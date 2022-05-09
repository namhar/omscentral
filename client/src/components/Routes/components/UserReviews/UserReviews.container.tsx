import React from 'react';
import { Helmet } from 'react-helmet';
import ReviewCardListConnected from 'src/components/ReviewCardListConnected';

const UserReviewsContainer: React.FC = () => {
  return (
    <>
      <Helmet title="My Reviews">
        <meta name="description" content="User's published reviews." />
      </Helmet>
      <ReviewCardListConnected variables={{ is_mine: true }} toolbar={false} />
    </>
  );
};

export default UserReviewsContainer;
