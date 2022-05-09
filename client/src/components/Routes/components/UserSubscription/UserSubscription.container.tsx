import React from 'react';
import { Helmet } from 'react-helmet';
import { paths } from 'src/constants';
import useCustomerPortalSession from 'src/core/hooks/useCustomerPortalSession';

import UserSubscription from './UserSubscription';

const UserSubscriptionContainer: React.FC = () => {
  const { loading, data, error } = useCustomerPortalSession(paths.landing);

  return (
    <>
      <Helmet title="My Subscription">
        <meta name="description" content="User subscription settings." />
      </Helmet>
      <UserSubscription
        loading={loading}
        session={data?.createCustomerPortalSession}
        error={!!error}
      />
    </>
  );
};

export default UserSubscriptionContainer;
