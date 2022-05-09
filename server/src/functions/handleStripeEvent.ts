import * as Sentry from '@sentry/node';
import assert from 'assert';
import Stripe from 'stripe';

import { logger, pp } from '../components';
import { stripeConfig } from '../config';
import { PricingTier } from '../enums';
import { Maybe } from '../graphql';
import { User } from '../models';

const priceToTier: { [id: string]: PricingTier } = {
  [stripeConfig.priceIds.basic]: PricingTier.Basic,
  [stripeConfig.priceIds.standard]: PricingTier.Standard,
  [stripeConfig.priceIds.premium]: PricingTier.Premium,
};

/**
 * Fulfills a customer's subscription order (by updating their user record).
 */
const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  try {
    // https://stripe.com/docs/api/checkout/sessions/object
    const session = event.data.object as Stripe.Checkout.Session;
    assert(session != null, 'session as nonnull');
    assert(session.metadata != null, 'metadata as nonnull');
    assert(typeof session.customer === 'string', 'customer as string');

    const pricingTier = session.metadata[pp.MetadataKey.PricingTier];
    assert(Object.values<string>(PricingTier).includes(pricingTier));

    await User.query()
      .patch({ pricing_tier: pricingTier as PricingTier })
      .where({ customer_id: session.customer });
  } catch (error) {
    logger.error('handleCheckoutSessionCompleted:', error);
    Sentry.captureException(error);
  }
};

const handleCustomerSubscriptionUpdated = async (
  event: Stripe.Event,
  { deleted = false }: { deleted?: boolean } = {},
) => {
  try {
    // https://stripe.com/docs/api/subscriptions/object
    const subscription = event.data.object as Stripe.Subscription;
    assert(subscription != null, 'subscription as nonnull');
    assert(typeof subscription.customer === 'string', 'customer as string');
    assert(subscription.items.data.length > 0, 'items nonempty');

    let pricingTier: Maybe<PricingTier> = null;
    if (!deleted) {
      const [item] = subscription.items.data;
      pricingTier = priceToTier[item.price.id];
      assert(pricingTier != null, 'tier as nonnull');
    }

    await User.query()
      .patch({ pricing_tier: pricingTier })
      .where({ customer_id: subscription.customer });
  } catch (error) {
    logger.error('handleCheckoutSessionCompleted:', error);
    Sentry.captureException(error);
  }
};

export const handleStripeEvent = async (event: Stripe.Event) => {
  logger.debug('handleStripeEvent:', event);
  switch (event.type) {
    case 'checkout.session.completed':
      return handleCheckoutSessionCompleted(event);
    case 'customer.subscription.updated':
      return handleCustomerSubscriptionUpdated(event);
    case 'customer.subscription.deleted':
      return handleCustomerSubscriptionUpdated(event, { deleted: true });
    default: {
      Sentry.captureMessage(`handleStripeEvent: ${event.type}`);
      logger.warn(`handleStripeEvent: ${event.type}`);
      break;
    }
  }
};
