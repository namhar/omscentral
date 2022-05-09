import { Pojo } from 'objection';
import { QueryBuilder } from 'objection';

import { AuthProvider, PricingTier, Role } from '../enums';
import { Maybe } from '../graphql';
import { UnixTime } from '../types';
import { Domain } from './Domain';
import { Program } from './Program';
import { Specialization } from './Specialization';
import { withDates } from './utils';

export class User extends withDates(Domain) {
  id!: string;
  auth_provider!: AuthProvider;
  password_hash!: Maybe<string>;
  password_salt!: Maybe<string>;
  email!: Maybe<string>;
  customer_id!: Maybe<string>; // from payment processor
  pricing_tier!: Maybe<PricingTier>; // nonnull if user has subscribed
  name!: Maybe<string>;
  role!: Role;
  photo_url!: Maybe<string>;
  anonymous!: boolean;
  program_id!: Maybe<string>;
  specialization_id!: Maybe<string>;
  last_signed_in!: UnixTime;

  program!: Maybe<Program>;
  specialization!: Maybe<Specialization>;

  $parseDatabaseJson(json: Pojo): Pojo {
    super.$parseDatabaseJson(json);
    return {
      ...json,
      last_signed_in: json.last_signed_in && Number(json.last_signed_in),
    };
  }

  static tableName = 'omscentral_user';

  static relationMappings = {
    program: {
      relation: Domain.HasOneRelation,
      modelClass: Program,
      join: {
        from: `${User.tableName}.program_id`,
        to: `${Program.tableName}.id`,
      },
    },
    specialization: {
      relation: Domain.HasOneRelation,
      modelClass: Specialization,
      join: {
        from: `${User.tableName}.specialization_id`,
        to: `${Specialization.tableName}.id`,
      },
    },
  };

  static jsonSchema = {
    type: 'object',
    required: ['id', 'auth_provider', 'last_signed_in'],
    properties: {
      id: { type: 'string' },
      auth_provider: { type: 'string' },
      password_hash: { type: ['string', 'null'] },
      password_salt: { type: ['string', 'null'] },
      email: { type: ['string', 'null'] },
      customer_id: { type: ['string', 'null'] },
      pricing_tier: { type: ['string', 'null'] },
      name: { type: ['string', 'null'] },
      role: { type: 'string' },
      photo_url: { type: ['string', 'null'] },
      anonymous: { type: 'boolean' },
      program_id: { type: ['string', 'null'] },
      program: Program.jsonSchema,
      specialization_id: { type: ['string', 'null'] },
      specialization: Specialization.jsonSchema,
      last_signed_in: { type: 'number' },
      created: { type: 'number' },
      updated: { type: ['number', 'null'] },
    },
  };

  static eagerQuery = (): QueryBuilder<User> =>
    User.query().withGraphFetched(`[
      program,
      specialization.[program]
    ]`);
}
