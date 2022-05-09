import * as Sentry from '@sentry/node';
import assert from 'assert';
import Stripe from 'stripe';

import { logger, pp } from '../components';
import { PricingTier } from '../enums';
import { User } from '../models';

/**
 * Fulfills a customer's subscription order (by updating their user record).
 */
const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  try {
    // https://stripe.com/docs/api/checkout/sessions/object
    const session = event.data.object as Stripe.Checkout.Session;
    assert(session != null, 'session must be nonnull');
    assert(session.metadata != null, 'metadata must be nonnull');
    assert(typeof session.customer === 'string', 'customer must be a string');

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

export const handleStripeEvent = async (event: Stripe.Event) => {
  logger.debug('handleStripeEvent:', event);
  switch (event.type) {
    case 'checkout.session.completed':
      return handleCheckoutSessionCompleted(event);
    default: {
      Sentry.captureMessage(`handleStripeEvent: ${event.type}`);
      logger.warn(`handleStripeEvent: ${event.type}`);
      break;
    }
  }
};
