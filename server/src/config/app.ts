import { root } from '../constants';

const pkg = require(`${root}/package.json`); // eslint-disable-line security/detect-non-literal-require

export type Environment = 'local' | 'test' | 'production';

export interface AppConfig {
  release: string;
  environment: Environment;
  name: string;
  version: string;
  port: number;
  rateLimit: boolean;
  clientUrl: string;
}

export const config: AppConfig = {
  release: `${pkg.name}@${pkg.version}`,
  environment: process.env.NODE_ENV as Environment,
  name: pkg.name,
  version: pkg.version,
  port: Number(process.env.PORT) || 8080,
  rateLimit: process.env.OMSCENTRAL_DISABLE_RATE_LIMIT !== 'true',
  clientUrl: process.env.OMSCENTRAL_CLIENT_URL || '',
};

if (!config.environment) {
  throw new Error('process.env.NODE_ENV required');
}

if (!config.clientUrl) {
  throw new Error('process.env.OMSCENTRAL_CLIENT_URL required');
}
