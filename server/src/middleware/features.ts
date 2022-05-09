import { Request as ExpressRequest, RequestHandler } from 'express';

import { Feature } from '../models';
import { Request } from '../types';
import { Features } from '../utils';

const cacheFeaturesAtAppLevelIfNeeded = async (
  req: ExpressRequest,
): Promise<Feature[]> => {
  const features = req.app.get('features') as Feature[] | undefined;

  req.app.set('features', features || (await Feature.query()));

  return req.app.get('features');
};

export const middleware = (): RequestHandler => async (req, res, next) => {
  const { user } = req as Request;
  const features = await cacheFeaturesAtAppLevelIfNeeded(req);
  (req as Request).features = new Features(user, features);

  next();
};
