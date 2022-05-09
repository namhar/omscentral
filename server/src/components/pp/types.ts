import Stripe from 'stripe';

export type EventHandler = (event: Stripe.Event) => void | Promise<void>;

export enum MetadataKey {
  UserId = 'user_id',
  PricingTier = 'pricing_tier',
}
