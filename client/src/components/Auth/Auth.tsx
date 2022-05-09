import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Nullable } from 'src/core';
import storage from 'src/core/utils/storage';
import apollo from 'src/data/apollo';
import { useUpsertUserMutation } from 'src/graphql';

import { FirebaseContext } from '../Firebase';
import { toInput } from './Auth.utils';

interface ContextValue {
  initializing: boolean;
  authenticated: boolean;
  user: Nullable<User>;
}

const initialValue: ContextValue = {
  initializing: true,
  authenticated: false,
  user: null,
};

export const AuthContext = createContext<ContextValue>(initialValue);

export const useAuth: () => ContextValue = () => useContext(AuthContext);

const Auth: React.FC = ({ children }) => {
  const firebase = useContext(FirebaseContext);
  const [value, setValue] = useState<ContextValue>(initialValue);
  const [upsertUser] = useUpsertUserMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, async (authUser) => {
      apollo.resetStore();

      setValue({
        initializing: false,
        authenticated: Boolean(authUser),
        user: authUser,
      });

      if (!authUser) {
        storage('session').removeItem('token');
        return;
      }

      storage('session').setItem('token', await authUser.getIdToken());

      const result = await upsertUser({
        variables: {
          user: toInput(authUser),
        },
      });

      if (result.errors && result.errors.length) {
        await signOut(firebase.auth);
        return;
      }

      if (firebase.analytics != null) {
        const user = result.data!.upsertUser;
        setUserId(firebase.analytics, user.id, { global: true });
        setUserProperties(firebase.analytics, { email: user.email });
        const method = user.auth_provider;
        logEvent(firebase.analytics, 'login', { method });
        if (!user.updated) {
          logEvent(firebase.analytics, 'sign_up', { method });
        }
      }
    });

    return () => unsubscribe();
  }, [firebase, upsertUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default Auth;
