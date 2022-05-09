import { badRequest } from '@hapi/boom';
import { isEmpty, map } from 'lodash';
import moment from 'moment';

import { FeatureAlias } from '../../enums';
import { searchReviews as search } from '../../functions';
import { QueryResolvers } from '../../graphql';
import { mapReview } from '../../mappers';
import { Review } from '../../models';

type Resolver = QueryResolvers['reviews'];

export const resolver: Resolver = async (
  _,
  {
    query,
    offset,
    limit,
    is_mine,
    course_ids,
    semester_ids,
    difficulties,
    ratings,
    order_by_desc,
  },
  { user, features },
) => {
  if (limit > 10) {
    throw badRequest();
  }

  // if (is_mine && )

  if (order_by_desc.includes('semester_id')) {
    features.assertIsEnabled(FeatureAlias.Sorting);
  }

  const qb = Review.eagerQuery();

  if (!features.isEnabled(FeatureAlias.AllReviews) && !is_mine) {
    qb.where('created', '<', moment().subtract(2, 'years').valueOf());
  }

  order_by_desc.forEach((column) => qb.orderBy(column, 'desc'));

  if (!isEmpty(query)) {
    features.assertIsEnabled(FeatureAlias.Search);

    const ids = await search({ query, offset, limit, sort: order_by_desc });
    qb.whereIn('id', ids);
  } else {
    is_mine && user != null && qb.where('author_id', user.id);
    qb.offset(offset).limit(limit);

    if (
      course_ids.length > 1 ||
      semester_ids.length ||
      difficulties.length ||
      ratings.length
    ) {
      features.assertIsEnabled(FeatureAlias.Filtering);
    }

    course_ids.length && qb.whereIn('course_id', course_ids);
    semester_ids.length && qb.whereIn('semester_id', semester_ids);
    difficulties.length && qb.whereIn('difficulty', difficulties);
    ratings.length && qb.whereIn('rating', ratings);
  }

  return map(await qb, (review) => mapReview(review, user));
};
