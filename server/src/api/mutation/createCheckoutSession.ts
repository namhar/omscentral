import { badRequest } from '@hapi/boom';

import { PricingTier } from '../../enums';
import { MutationResolvers } from '../../graphql';

const planToTier: { [key: string]: PricingTier } = {
  basic: PricingTier.Basic,
  standard: PricingTier.Standard,
  premium: PricingTier.Premium,
};

type Resolver = MutationResolvers['createCheckoutSession'];

export const resolver: Resolver = async (
  _,
  { input: { plan } },
  { pp, user },
) => {
  const pricingTier = planToTier[plan];
  if (pricingTier == null) {
    throw badRequest('Provided plan identifier is invalid.');
  }

  if (user == null) {
    return {
      url: null,
    };
  }

  const session = await pp.createCheckoutSession(pricingTier);

  return {
    url: session.url,
  };
};
