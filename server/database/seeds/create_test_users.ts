import { each } from 'bluebird';
import Knex from 'knex';
import { Model, ModelObject } from 'objection';

import { firebase, logger } from '../../src/components';
import { appConfig } from '../../src/config';
import { AuthProvider, Role } from '../../src/enums';
import { upsertUser } from '../../src/functions';
import { Program, Specialization, User } from '../../src/models';

export const seed = async (knex: Knex): Promise<void> => {
  Model.knex(knex);

  if (appConfig.environment === 'production') {
    return;
  }

  const [program, specialization] = await Promise.all([
    Program.query().first(),
    Specialization.query().first(),
  ]);

  if (!program || !specialization) {
    return;
  }

  const timestamp = +new Date();

  const users: ModelObject<User>[] = [
    {
      anonymous: false,
      auth_provider: AuthProvider.Password,
      customer_id: null,
      pricing_tier: null,
      created: timestamp,
      email: 'user@omscentral.com',
      id: '2iAc9zFUeUcCblZ68PTOqdFdpSr1',
      last_signed_in: timestamp,
      name: 'Test User',
      password_hash: null,
      password_salt: null,
      photo_url: null,
      program_id: program.id,
      program: program,
      role: Role.Basic,
      specialization_id: specialization.id,
      specialization: specialization,
      updated: timestamp,
    },
  ];

  await each(users, async (user) => {
    if (!user.email) {
      return;
    }

    await upsertUser(user.id as string, user);

    try {
      await firebase.auth().createUser({
        uid: user.id,
        email: user.email,
        password: '12341234',
        disabled: false,
        emailVerified: true,
        displayName: user.name,
      });
    } catch (error: any) {
      logger.debug(`${user.email}: ${error.message}`);
    }

    logger.debug(`${user.email}: created`);
  });
};
