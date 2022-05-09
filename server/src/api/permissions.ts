import { forbidden } from '@hapi/boom';
import { allow, deny, or, rule, shield } from 'graphql-shield';

import { logger } from '../components';
import { appConfig } from '../config';
import { Context } from '../types';

const isSignedIn = rule()((_, __, { req }: Context) => !!req.userId);

const isSignedOut = rule()((_, __, { req }: Context) => !req.userId);

const isSelf = rule()(
  (_, { id }: { id: string }, { req }: Context) => id === req.userId,
);

export const permissions = shield(
  {
    Query: {
      '*': deny,
      config: allow,
      course: allow,
      courses: allow,
      courseSeries: allow,
      features: allow,
      pricingTiers: allow,
      programs: allow,
      review: allow,
      reviews: allow,
      semesters: allow,
      specializations: allow,
      user: or(isSignedOut, isSelf),
      words: allow,
    },
    Mutation: {
      '*': deny,
      upsertUser: isSignedIn,
      updateUser: isSignedIn,
      insertReview: isSignedIn,
      updateReview: isSignedIn,
      deleteReview: isSignedIn,
      reportReview: isSignedIn,
      createCheckoutSession: isSignedIn,
      createCustomerPortalSession: allow,
    },
  },
  {
    fallbackRule: allow,
    fallbackError: (error: any): any => {
      error && logger.error('permissions:', error);
      if (appConfig.environment === 'local') {
        throw forbidden(error);
      } else {
        throw forbidden();
      }
    },
  },
);
