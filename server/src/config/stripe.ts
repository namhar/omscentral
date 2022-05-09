import { PricingTier } from '../enums';

export interface Config {
  apiKey: string;
  endpointSecret: string;
  accountId: string;
  productIds: {
    [key in PricingTier]: string;
  };
  priceIds: {
    [key in PricingTier]: string;
  };
}

const {
  OMSCENTRAL_STRIPE_API_KEY = '',
  OMSCENTRAL_STRIPE_ENDPOINT_SECRET = '',
  OMSCENTRAL_STRIPE_ACCOUNT_ID = '',
  OMSCENTRAL_STRIPE_TIER_1_PRODUCT_ID = '',
  OMSCENTRAL_STRIPE_TIER_2_PRODUCT_ID = '',
  OMSCENTRAL_STRIPE_TIER_3_PRODUCT_ID = '',
  OMSCENTRAL_STRIPE_TIER_1_PRICE_ID = '',
  OMSCENTRAL_STRIPE_TIER_2_PRICE_ID = '',
  OMSCENTRAL_STRIPE_TIER_3_PRICE_ID = '',
} = process.env;

export const config: Config = {
  apiKey: OMSCENTRAL_STRIPE_API_KEY,
  endpointSecret: OMSCENTRAL_STRIPE_ENDPOINT_SECRET,
  accountId: OMSCENTRAL_STRIPE_ACCOUNT_ID,
  productIds: {
    [PricingTier.Basic]: OMSCENTRAL_STRIPE_TIER_1_PRODUCT_ID,
    [PricingTier.Standard]: OMSCENTRAL_STRIPE_TIER_2_PRODUCT_ID,
    [PricingTier.Premium]: OMSCENTRAL_STRIPE_TIER_3_PRODUCT_ID,
  },
  priceIds: {
    [PricingTier.Basic]: OMSCENTRAL_STRIPE_TIER_1_PRICE_ID,
    [PricingTier.Standard]: OMSCENTRAL_STRIPE_TIER_2_PRICE_ID,
    [PricingTier.Premium]: OMSCENTRAL_STRIPE_TIER_3_PRICE_ID,
  },
};
