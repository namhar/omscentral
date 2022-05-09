import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { logEvent } from 'firebase/analytics';
import React, { useContext } from 'react';
import Link from 'src/components/Link';
import { paths } from 'src/constants';
import { ReviewsQuery } from 'src/graphql';

import { FirebaseContext } from '../Firebase';
import Loading from '../Loading';
import { NotificationContext } from '../Notification';
import Paper from '../Paper';
import ReviewCard from '../ReviewCard';

type Reviews = ReviewsQuery['reviews'];

interface Props {
  loading?: boolean;
  reviews?: Reviews;
  onReportClick: (id: string) => void;
  highlight?: string;
  whenEmpty?: JSX.Element;
  before?: JSX.Element;
  after?: JSX.Element;
}

const ReviewCardList: React.FC<Props> = ({
  loading,
  reviews,
  onReportClick,
  highlight,
  whenEmpty = (
    <Typography>
      There are no reviews to display. <Link to="">Go back</Link>.
    </Typography>
  ),
  before,
  after,
}) => {
  const notification = useContext(NotificationContext)!;
  const firebase = useContext(FirebaseContext);

  const getDeepLink = (id: string): string =>
    `${location.protocol}//${location.host}${paths.review.update(id)}`;

  const handleLinkClick = (id: string) => {
    notification.success('Link copied to clipboard.');
    logEvent(firebase.analytics, 'share', {
      content_type: 'review',
      content_id: id,
      method: 'copy_deep_link',
    });
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper>
        {loading && !reviews?.length ? (
          <Loading />
        ) : reviews?.length ? (
          <Grid container spacing={2}>
            {before && (
              <Grid item xs={12}>
                {before}
              </Grid>
            )}

            {reviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <ReviewCard
                  review={review}
                  highlight={highlight}
                  deepLink={getDeepLink(review.id)}
                  onLinkClick={() => handleLinkClick(review.id)}
                  onReportClick={() => onReportClick(review.id)}
                  disabled={loading}
                />
              </Grid>
            ))}

            {after && (
              <Grid item xs={12}>
                {after}
              </Grid>
            )}
          </Grid>
        ) : (
          whenEmpty
        )}
      </Paper>
    </Container>
  );
};

export default ReviewCardList;
