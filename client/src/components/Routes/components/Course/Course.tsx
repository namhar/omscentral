import Grid from '@material-ui/core/Grid';
import React from 'react';
import Metrics from 'src/components/Metrics';
import ReviewCardListConnected from 'src/components/ReviewCardListConnected';
import { Course as GQLCourse } from 'src/graphql';

import LimitedReviewsGuidance from '../LimitedReviewsGuidance';

interface Props {
  course: GQLCourse;
}

const Course: React.VFC<Props> = ({ course }) => {
  return (
    <ReviewCardListConnected
      variables={{ course_ids: [course.id] }}
      before={
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LimitedReviewsGuidance />
          </Grid>
          <Grid item xs={12}>
            <Metrics course={course} />
          </Grid>
        </Grid>
      }
    />
  );
};

export default Course;
