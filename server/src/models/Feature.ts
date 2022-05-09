import { Pojo } from 'objection';

import { FeatureAlias, FeatureStatus, PricingTier } from '../enums';
import { Maybe } from '../graphql';
import { UnixTime } from '../types';
import { Domain } from './Domain';

export class Feature extends Domain {
  id!: string;
  alias!: FeatureAlias;
  name!: string;
  description!: string;
  pricing_tier!: Maybe<PricingTier>; // min tier required to access feature
  release_date!: UnixTime;
  status!: FeatureStatus;

  $parseDatabaseJson(json: Pojo): Pojo {
    super.$parseDatabaseJson(json);
    return {
      ...json,
      release_date: json.release_date && Number(json.release_date),
    };
  }

  static tableName = 'omscentral_feature';

  static jsonSchema = {
    type: 'object',
    required: ['id', 'alias', 'name', 'description', 'release_date', 'status'],
    properties: {
      id: { type: 'string' },
      alias: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      pricing_tier: { type: ['string', 'null'] },
      release_date: { type: 'number' },
      status: { type: 'string' },
    },
  };
}
