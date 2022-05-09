import { MutationResolvers } from '../../graphql';

type Resolver = MutationResolvers['createCustomerPortalSession'];

export const resolver: Resolver = async (
  _,
  { input: { returnUrl } },
  { pp, user },
) => {
  if (user == null) {
    return {
      url: null,
    };
  }

  return pp.createCustomerPortalSession(returnUrl);
};
