import { raw } from 'body-parser';
import { Router } from 'express';

import { EventHandler } from './types';
import { webhook } from './webhook';

export const router = (onEvent: EventHandler): Router => {
  const pprouter = Router();

  pprouter.use(raw({ type: 'application/json' }));
  pprouter.post('/webhook', webhook(onEvent));

  return pprouter;
};
