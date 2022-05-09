import {
  Analytics,
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  AuthProvider,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import { FirebasePerformance, getPerformance } from 'firebase/performance';
import React, { createContext, useContext } from 'react';
import { firebaseConfig } from 'src/config';

const app = initializeApp(firebaseConfig);

interface ContextValue {
  analytics: Analytics;
  auth: Auth;
  authProviders: {
    facebook: AuthProvider;
    github: AuthProvider;
    google: AuthProvider;
    twitter: AuthProvider;
  };
  performance: FirebasePerformance;
}

const value: ContextValue = {
  analytics: getAnalytics(app),
  auth: getAuth(),
  authProviders: {
    facebook: (() => {
      // https://firebase.google.com/docs/auth/web/facebook-login
      const p = new FacebookAuthProvider();
      p.addScope('email');
      return p;
    })(),
    github: (() => {
      // https://firebase.google.com/docs/auth/web/github-auth
      const p = new GithubAuthProvider();
      p.addScope('user');
      return p;
    })(),
    google: (() => {
      // https://firebase.google.com/docs/auth/web/google-signin
      const p = new GoogleAuthProvider();
      p.addScope('profile');
      p.addScope('email');
      return p;
    })(),
    twitter: (() => {
      // https://firebase.google.com/docs/auth/web/twitter-login
      return new TwitterAuthProvider();
    })(),
  },
  performance: getPerformance(app),
};

if (process.env.NODE_ENV !== 'production') {
  setAnalyticsCollectionEnabled(value.analytics, false);
}

export const FirebaseContext = createContext<ContextValue>(value);

export const useFirebase: () => ContextValue = () =>
  useContext(FirebaseContext);

const Firebase: React.FC = ({ children }) => (
  <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
);

export default Firebase;
