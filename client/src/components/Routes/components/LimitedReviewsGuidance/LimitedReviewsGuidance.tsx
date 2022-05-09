import Alert from '@material-ui/lab/Alert';
import React from 'react';
import Link from 'src/components/Link/Link';
import { paths } from 'src/constants';
import useOMSUser from 'src/core/hooks/useOMSUser';

const LimitedReviewsGuidance: React.VFC = () => {
  const user = useOMSUser();

  if (user == null || user?.pricing_tier != null) {
    return null;
  }

  return (
    <Alert severity="warning">
      You are only seeing reviews from &gt;2 years ago. To see all reviews,{' '}
      <Link to={paths.pricing()}>sign up for a plan</Link>.
    </Alert>
  );
};

export default LimitedReviewsGuidance;
