import { Nullable } from 'src/core';
import { OMSUser } from 'src/core/hooks/useOMSUser';
import { Feature } from 'src/graphql';

import * as utils from './Features.utils';

describe('Features.utils', () => {
  describe('satisfiesPricingTierCondition', () => {
    const { satisfiesPricingTierCondition: sut } = utils;

    let feature: Feature;
    let user: Nullable<OMSUser>;

    beforeEach(() => {
      feature = {
        alias: 'alias',
        description: 'description',
        id: 'id',
        name: 'name',
        release_date: 1,
        status: 'on',
        pricing_tier: null,
      };

      user = {
        auth_provider: 'google.com',
        id: 'id',
        last_signed_in: 10,
        pricing_tier: null,
      };
    });

    describe('given feature is unrestricted by pricing tier', () => {
      beforeEach(() => {
        feature.pricing_tier = null;
      });

      it('passes', () => {
        expect(sut(feature, user)).toEqual(true);
      });
    });

    describe.each<
      [Nullable<utils.PricingTier>, Nullable<utils.PricingTier>, boolean]
    >([
      [null, null, true],
      [null, 'basic', true],
      [null, 'standard', true],
      [null, 'premium', true],
      ['basic', null, false],
      ['basic', 'basic', true],
      ['basic', 'standard', true],
      ['basic', 'premium', true],
      ['standard', null, false],
      ['standard', 'basic', false],
      ['standard', 'standard', true],
      ['standard', 'premium', true],
      ['premium', null, false],
      ['premium', 'basic', false],
      ['premium', 'standard', false],
      ['premium', 'premium', true],
    ])('given feature tier = %p, user tier = %p', (fTier, uTier, expected) => {
      beforeEach(() => {
        feature.pricing_tier = fTier;
        user!.pricing_tier = uTier;
      });

      it('passes', () => {
        expect(sut(feature, user)).toEqual(expected);
      });
    });
  });
});
