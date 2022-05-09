import { QueryResolvers } from '../../graphql';
import { Feature } from '../../models';

type Resolver = QueryResolvers['features'];

export const resolver: Resolver = () =>
  Feature.query().orderBy('release_date', 'asc').orderBy('name', 'asc');
