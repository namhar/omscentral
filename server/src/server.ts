require('./env')();

import { ApolloServer } from 'apollo-server-express';

import { app } from './app';
import { logger } from './components';

app.boot((error?: Error) => {
  if (error) {
    if (process.env.NODE_ENV === 'local') {
      console.log(error); // eslint-disable-line no-console
    }
    throw error;
  }

  const server: ApolloServer = app.get('server');
  const port: number = app.get('port');

  server.applyMiddleware({ app });

  app.listen(port, () => {
    logger.info(`🚀 Server listening on ${port}${server.graphqlPath} ...`);
  });
});
