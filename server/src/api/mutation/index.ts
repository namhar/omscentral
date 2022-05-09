import { MutationResolvers } from '../../graphql';
import { resolver as createCheckoutSession } from './createCheckoutSession';
import { resolver as createCustomerPortalSession } from './createCustomerPortalSession';
import { resolver as deleteReview } from './deleteReview';
import { resolver as insertReview } from './insertReview';
import { resolver as reportReview } from './reportReview';
import { resolver as updateReview } from './updateReview';
import { resolver as updateUser } from './updateUser';
import { resolver as upsertUser } from './upsertUser';

export const Mutation: MutationResolvers = {
  deleteReview,
  insertReview,
  reportReview,
  updateReview,
  updateUser,
  upsertUser,
  createCheckoutSession,
  createCustomerPortalSession,
};
