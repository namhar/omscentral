import React, { Suspense, useContext } from 'react';
import { Router } from 'react-router-dom';
import { browserHistory } from 'src/constants';

import Actions from '../Actions';
import { AuthContext } from '../Auth';
import ConversionLogger from '../ConversionLogger';
import ErrorBoundary from '../ErrorBoundary';
import Loading from '../Loading';
import Navbar from '../Navbar';
import Notification from '../Notification';
import Routes from '../Routes';
import { useStyles } from './App.styles';

const App: React.FC = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  return (
    <Router history={browserHistory}>
      <ErrorBoundary>
        <Notification>
          <Navbar />
          {auth.initializing ? (
            <Loading />
          ) : (
            <div className={classes.main}>
              <Suspense fallback={<Loading />}>
                <Routes />
              </Suspense>
            </div>
          )}
          <Actions />
          <ConversionLogger />
        </Notification>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
