import { RequestHandler } from 'express';

import { Request } from '../../types';
import { PaymentProcessor } from './PaymentProcessor';

export const middleware = (): RequestHandler => async (req, res, next) => {
  const { user } = req as Request;

  if (user != null) {
    (req as Request).pp = new PaymentProcessor(user);
  }

  next();
};
