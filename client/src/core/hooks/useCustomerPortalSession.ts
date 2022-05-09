import { ApolloError } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CreateCustomerPortalSessionMutation,
  Maybe,
  useCreateCustomerPortalSessionMutation,
} from 'src/graphql';

const useCustomerPortalSession = (
  returnUrl?: string,
): {
  loading: boolean;
  data?: Maybe<CreateCustomerPortalSessionMutation>;
  error?: ApolloError;
} => {
  const { pathname, search } = useLocation();

  const [createSession, { loading, data, error }] =
    useCreateCustomerPortalSessionMutation();

  useEffect(() => {
    createSession({
      variables: {
        input: {
          returnUrl: location.href,
        },
      },
    });
  }, [createSession, pathname, search, returnUrl]);

  return useMemo(() => ({ loading, data, error }), [loading, data, error]);
};

export default useCustomerPortalSession;
