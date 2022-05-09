import { forbidden } from '@hapi/boom';

import { FeatureAlias, PricingTier } from '../enums';
import { Maybe } from '../graphql';
import { Feature, User } from '../models';

export class Features {
  // TODO: de-duplicate client/src/components/Features/Features.utils.ts
  private static accessibleTiers: {
    [key in PricingTier]: {
      [key in PricingTier]: boolean;
    };
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

  private static satisfiesPricingTierCondition(
    feature: Feature,
    user: Maybe<User>,
  ): boolean {
    if (feature.pricing_tier == null) {
      return true;
    }

    // treat unauthenticated same as a user without a subscription
    if (user == null || user.pricing_tier == null) {
      return false;
    }

    const uTier = user.pricing_tier as PricingTier;
    const fTier = feature.pricing_tier as PricingTier;

    return this.accessibleTiers[uTier][fTier];
  }

  constructor(private user: Maybe<User>, private features: Feature[]) {}

  public isEnabled(aliasOrFeature: FeatureAlias | Feature): boolean {
    const feature: Feature | undefined =
      typeof aliasOrFeature === 'string'
        ? this.features.find(({ alias }) => alias === aliasOrFeature)
        : aliasOrFeature;

    return (
      feature != null &&
      feature.status === 'on' &&
      Features.satisfiesPricingTierCondition(feature, this.user)
    );
  }

  public assertIsEnabled(alias: FeatureAlias): void {
    if (!this.isEnabled(alias)) {
      throw forbidden(`feature.${alias}`);
    }
  }
}
