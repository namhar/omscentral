import { QueryResolvers } from '../../graphql';
import { Course } from '../../models';

type Resolver = QueryResolvers['courses'];

export const resolver: Resolver = (_, __, { features }) =>
  Course.eagerQuery()
    .orderBy('id')
    .then((courses) =>
      courses.map((course) => course.withoutMetrics(features)),
    );
