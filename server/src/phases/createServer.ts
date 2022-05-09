import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { Response } from 'express';
import fs from 'fs';
import { applyMiddleware } from 'graphql-middleware';
import path from 'path';

import { Mutation, permissions, Query } from '../api';
import { logger, PhaseFunction } from '../components';
import { appConfig, graphqlConfig } from '../config';
import { root } from '../constants';
import { getUser } from '../functions';
import { Context, Request } from '../types';

export const phase: PhaseFunction = (app, next) => {
  const schemaFile = path.join(root, 'src', 'graphql', 'schema.graphql');
  const schema = applyMiddleware(
    makeExecutableSchema<Context>({
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      typeDefs: fs.readFileSync(schemaFile, 'utf8'),
      resolvers: {
        Query,
        Mutation,
      },
    }),
    permissions,
  );

  const server = new ApolloServer({
    schema,
    resolvers: {
      Query,
      Mutation,
    },
    context: async ({
      req,
      res,
    }: {
      req: Request;
      res: Response;
    }): Promise<Context> => {
      const { userId } = req;
      const user = userId ? await getUser(userId) : null;
      return {
        req,
        res,
        user,
        features: req.features,
        pp: req.pp,
        logger,
      };
    },
    playground: graphqlConfig.playground,
    engine: {
      reportSchema: graphqlConfig.reportSchema,
      graphVariant: 'current',
    },
  });

  app.set('server', server);
  app.set('port', appConfig.port);

  next();
};
