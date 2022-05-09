import { notFound } from '@hapi/boom';

import { FeatureAlias } from '../../enums';
import { getCourseSeries } from '../../functions';
import { QueryResolvers } from '../../graphql';
import { Course } from '../../models';

type Resolver = QueryResolvers['courseSeries'];

export const resolver: Resolver = async (_, { id }, { features }) => {
  features.assertIsEnabled(FeatureAlias.Trends);

  const course = await Course.eagerQuery().findById(id);
  if (!course) {
    throw notFound();
  }

  return getCourseSeries(course);
};
