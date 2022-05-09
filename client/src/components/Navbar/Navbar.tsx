import { logEvent } from '@firebase/analytics';
import AppBar from '@material-ui/core/AppBar';
import { Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { paths, urls } from 'src/constants';
import { QueryParam } from 'src/core';
import useQueryParams from 'src/core/hooks/useQueryParams';

import { AuthContext } from '../Auth';
import { FirebaseContext } from '../Firebase';
import Grow from '../Grow';
import NavbarButton from './components/NavbarButton';
import SearchInput from './components/SearchInput';
import UserMenu from './components/UserMenu';
import { useStyles } from './Navbar.styles';

const Navbar: React.FC = () => {
  const classes = useStyles();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const sm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const firebase = useContext(FirebaseContext);
  const auth = useContext(AuthContext);
  const history = useHistory();
  const params = useQueryParams<{ [QueryParam.Query]: string }>();
  const [query, setQuery] = useState(params.query || '');

  useEffect(() => {
    setQuery(params.query || '');
  }, [params.query]);

  const handleSearchSubmit = (query: string) => {
    if (query) {
      history.push(paths.reviews({ query }));
      logEvent(firebase.analytics, 'search', { search_term: query });
    }
  };

  return (
    <div className={classes.root} data-cy="navbar">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            OMSCentral
          </Typography>
          <NavbarButton path={paths.courses}>Courses</NavbarButton>
          {!xs && <NavbarButton path={paths.reviews()}>Reviews</NavbarButton>}
          <NavbarButton path={paths.trends}>Trends</NavbarButton>
          {!sm && (
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSearchSubmit}
            />
          )}
          <Grow />
          {!xs && (
            <NavbarButton onClick={() => window.open(urls.support)}>
              Support
            </NavbarButton>
          )}
          <NavbarButton path={paths.pricing()}>Pricing</NavbarButton>
          {auth.initializing ? null : auth.authenticated ? (
            <UserMenu />
          ) : (
            <NavbarButton path={paths.login}>Login</NavbarButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
