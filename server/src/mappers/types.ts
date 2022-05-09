import { Maybe } from '../graphql';
import { Domain, User } from '../models';

export type Mapper<TEntity extends Domain, TGraphQLEntity> = (
  entity: TEntity,
  user: Maybe<User>,
) => TGraphQLEntity;
