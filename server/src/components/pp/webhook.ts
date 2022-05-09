import * as Sentry from '@sentry/node';
import { RequestHandler } from 'express';

import { logger } from '../../components';
import { EventHandler } from './types';

export const webhook =
  (onEvent: EventHandler): RequestHandler =>
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (signature == null) {
      return res.sendStatus(400);
    }
    try {
      await onEvent(req.body);
      res.sendStatus(200);
    } catch (error) {
      Sentry.captureException(error);
      logger.error('/pp/webhook:', error);
      res.sendStatus(400);
    }
  };
