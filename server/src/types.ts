import { Request as BaseRequest, Response } from 'express';
import { Logger } from 'winston';

import { pp } from './components';
import { Maybe } from './graphql';
import { User } from './models';
import { Features } from './utils';

export type Request = BaseRequest & {
  userId: Maybe<string>;
  user: Maybe<User>;
  features: Features;
  pp: pp.PaymentProcessor;
};

export interface Context {
  req: Request;
  res: Response;
  logger: Logger;
  user: Maybe<User>;
  features: Features;
  pp: pp.PaymentProcessor;
}

export type UnixTime = number;
