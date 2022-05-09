import { Nullable } from 'src/core';
import { OMSUser } from 'src/core/hooks/useOMSUser';
import { Feature } from 'src/graphql';

export type PricingTier = 'basic' | 'standard' | 'premium';

// TODO: de-duplicate server/src/utils/Features.ts

const accessibleTiers: {
  [key in PricingTier]: { [key in PricingTier]: boolean };
} = {
  basic: {
    basic: true,
    standard: false,
    premium: false,
  },
  standard: {
    basic: true,
    standard: true,
    premium: false,
  },
  premium: {
    basic: true,
    standard: true,
    premium: true,
  },
};

export const satisfiesPricingTierCondition = (
  feature: Feature,
  user: Nullable<OMSUser>,
): boolean => {
  if (feature.pricing_tier == null) {
    return true;
  }

  // treat unauthenticated same as a user without a subscription
  if (user == null || user.pricing_tier == null) {
    return false;
  }

  const uTier = user.pricing_tier as PricingTier;
  const fTier = feature.pricing_tier as PricingTier;

  return accessibleTiers[uTier][fTier];
};
