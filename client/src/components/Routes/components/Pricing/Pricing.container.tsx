import React from 'react';
import Helmet from 'react-helmet';

import Pricing from './Pricing';

const PricingContainer: React.VFC = () => (
  <>
    <Helmet title="Pricing">
      <meta
        name="description"
        content="Subscription plans for omscentral.com."
      />
    </Helmet>
    <Pricing content={null} />
  </>
);

export default PricingContainer;
