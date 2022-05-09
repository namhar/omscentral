import { features } from '../../database/data';
import { Feature } from '../models';

export const upsertFeatures = async (): Promise<void> => {
  await Feature.query().upsertGraph(features, {
    insertMissing: true,
    noDelete: true,
  });
};
