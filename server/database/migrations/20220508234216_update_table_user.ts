import Knex from 'knex';

import { User } from '../../src/models';
import { addColumn, dropColumn } from '../utils';

exports.up = async (knex: Knex) => {
  await addColumn(knex, User.tableName, 'customer_id', (tb) => {
    tb.string('customer_id').nullable().index();
  });
};

exports.down = async (knex: Knex) => {
  await dropColumn(knex, User.tableName, 'customer_id');
};
