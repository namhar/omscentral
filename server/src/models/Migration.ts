import { UnixTime } from '../types';
import { Domain } from './Domain';

export class Migration extends Domain {
  id!: number;
  name!: string;
  batch!: number;
  migration_time!: UnixTime;

  static tableName = 'omscentral_migration';
}
