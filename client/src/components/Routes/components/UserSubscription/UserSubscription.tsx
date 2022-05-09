import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import Link from 'src/components/Link';
import Loading from 'src/components/Loading';
import Paper from 'src/components/Paper';
import White from 'src/components/White';
import { paths } from 'src/constants';
import { Session } from 'src/graphql';

interface Props {
  loading?: boolean;
  error?: boolean;
  session?: Session;
}

const UserSubscription: React.VFC<Props> = ({
  loading = false,
  error = false,
  session,
}) => (
  <Container component="main" maxWidth="sm">
    <White />
    <Paper>
      {loading && <Loading />}
      <Grid container>
        {session != null && session.url != null && (
          <Grid item xs={12}>
            <Alert severity="info">
              Manage your subscription through{' '}
              <Link
                to={session.url}
                replace
                style={{ textDecoration: 'underline' }}
              >
                the billing portal
              </Link>{' '}
              or{' '}
              <Link
                to={paths.pricing()}
                style={{ textDecoration: 'underline' }}
              >
                the pricing page
              </Link>
              .
            </Alert>
          </Grid>
        )}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">
              There was an error while initializing the billing portal.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  </Container>
);

export default UserSubscription;
