import { FeatureAlias } from '../../enums';
import { QueryResolvers } from '../../graphql';
import { Specialization } from '../../models';

type Resolver = QueryResolvers['specializations'];

export const resolver: Resolver = (_, __, { features }) =>
  features.isEnabled(FeatureAlias.Specializations)
    ? Specialization.eagerQuery().orderBy('name')
    : [];
