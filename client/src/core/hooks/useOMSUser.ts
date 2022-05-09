import { useContext } from 'react';
import { AuthContext } from 'src/components/Auth/Auth';
import { Nullable } from 'src/core';
import { UserQuery, useUserQuery } from 'src/graphql';

export type OMSUser = Omit<UserQuery['user'], '__typename'>;

const useOMSUser = (): Nullable<OMSUser> => {
  const { user } = useContext(AuthContext);

  const { data } = useUserQuery({
    skip: user == null,
    variables: {
      id: user?.uid ?? '',
    },
    fetchPolicy: 'no-cache',
  });

  return data?.user ?? null;
};

export default useOMSUser;
