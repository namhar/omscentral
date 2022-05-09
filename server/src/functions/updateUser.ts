import { PartialModelObject as PMO } from 'objection';

import { User } from '../models';

export const updateUser = (id: string, user: PMO<User>): Promise<User> => {
  return User.eagerQuery().patchAndFetchById(id, user);
};
