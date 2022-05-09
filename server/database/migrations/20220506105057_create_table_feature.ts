import Knex from 'knex';

import { FeatureAlias, FeatureStatus, PricingTier } from '../../src/enums';
import { Feature } from '../../src/models';
import { createTable, dropTable } from '../utils';

exports.up = async (knex: Knex) => {
  await createTable(knex, Feature.tableName, (tb) => {
    tb.string('id').notNullable().primary();

    tb.enu('alias', Object.values(FeatureAlias)).notNullable().unique();
    tb.string('name').notNullable().unique();
    tb.string('description').notNullable();
    tb.enu('pricing_tier', Object.values(PricingTier)).nullable();
    tb.bigInteger('release_date').notNullable();
    tb.enu('status', Object.values(FeatureStatus)).notNullable();
  });
};

exports.down = async (knex: Knex) => {
  await dropTable(knex, Feature.tableName);
};
