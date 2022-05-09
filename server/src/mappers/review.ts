import { Maybe, Review as GraphQLReview } from '../graphql';
import { Review, User } from '../models';
import { mapReviewReport } from './reviewReport';
import { Mapper } from './types';

const THRESHOLD = 2;

const MASKED_BODY = `__Review content has been hidden due to user reports.__`;

export const mapReview: Mapper<Review, GraphQLReview> = (
  review: Review,
  user: Maybe<User>,
): GraphQLReview => {
  if (review.reports.length >= THRESHOLD && review.author.id !== user?.id) {
    review.body = MASKED_BODY;
  }

  return {
    ...review,
    is_mine: user != null && review.author.id === user.id,
    reports: review.reports.map((report) => mapReviewReport(report, user)),
  };
};
