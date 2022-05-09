import { PricingTier } from '../../enums';
import { QueryResolvers } from '../../graphql';

type Resolver = QueryResolvers['pricingTiers'];

export const resolver: Resolver = () => [
  {
    id: PricingTier.Basic,
    name: 'Basic',
    features: [],
    price: {
      amount: 3.99,
    },
  },
  {
    id: PricingTier.Standard,
    name: 'Standard',
    features: [],
    price: {
      amount: 6.99,
    },
  },
  {
    id: PricingTier.Premium,
    name: 'Premium',
    features: [],
    price: {
      amount: 9.99,
    },
  },
];
