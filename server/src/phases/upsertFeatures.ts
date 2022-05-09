import { PhaseFunction } from '../components';
import { upsertFeatures } from '../functions';

export const phase: PhaseFunction = async (app, next) => {
  try {
    await upsertFeatures();
    next();
  } catch (error: any) {
    next(error);
  }
};
