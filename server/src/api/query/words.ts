import { chain, toLower } from 'lodash';

import { FeatureAlias } from '../../enums';
import { QueryResolvers } from '../../graphql';
import { Review } from '../../models';

type Resolver = QueryResolvers['words'];

export const resolver: Resolver = async (_, { course_id }, { features }) => {
  if (!features.isEnabled(FeatureAlias.WordCloud)) {
    return [];
  }

  const reviews = await Review.eagerQuery()
    .select('body')
    .where('course_id', course_id);

  return chain(reviews)
    .map('body')
    .compact()
    .map(toLower)
    .flatMap((text) => text.split(/[^\w]+/g)) // non-words
    .compact()
    .reject((text) => /^\d+$/.test(text)) // strictly digits
    .countBy()
    .map((value, text) => ({ text, value }))
    .value();
};
