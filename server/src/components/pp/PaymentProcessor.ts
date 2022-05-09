import Stripe from 'stripe';

import { stripeConfig } from '../../config';
import { PricingTier } from '../../enums';
import { User } from '../../models';
import { cancelUrl, successUrl } from './constants';
import { MetadataKey } from './types';

export class PaymentProcessor {
  public static stripe: Stripe = new Stripe(stripeConfig.apiKey, {
    apiVersion: '2020-08-27',
  });

  constructor(private user: User, public stripe = PaymentProcessor.stripe) {}

  async createCheckoutSession(pricingTier: PricingTier) {
    const customer_id = await this.getOrCreateCustomer();

    const session = await this.stripe.checkout.sessions.create({
      customer: customer_id,
      line_items: [
        {
          price: stripeConfig.priceIds[pricingTier],
          quantity: 1,
        },
      ],
      metadata: {
        [MetadataKey.PricingTier]: pricingTier,
      },
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  }

  async createCustomerPortalSession(returnUrl: string) {
    const customer_id = await this.getOrCreateCustomer();

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: returnUrl,
    });

    return session;
  }

  /**
   * @returns Customer ID.
   */
  public async getOrCreateCustomer(): Promise<string> {
    if (this.user.customer_id != null) {
      return this.user.customer_id;
    }

    const customer = await this.stripe.customers.create({
      email: this.user.email ?? undefined,
      description: this.user.id,
    });

    await User.query().patchAndFetchById(this.user.id, {
      customer_id: customer.id,
    });

    return customer.id;
  }
}
