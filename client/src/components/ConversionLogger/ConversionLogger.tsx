import { logEvent } from 'firebase/analytics';
import React, { useEffect } from 'react';
import { QueryParam } from 'src/core';
import useQueryParams from 'src/core/hooks/useQueryParams';

import { useFirebase } from '../Firebase';

const ConversionLogger: React.VFC = () => {
  const { session_id } = useQueryParams<{ [QueryParam.Session]: string }>();

  const firebase = useFirebase();

  useEffect(() => {
    if (session_id != null && session_id.length > 0) {
      logEvent(firebase.analytics, 'purchase', { transaction_id: session_id });
    }
  }, [session_id, firebase.analytics]);

  return null;
};

export default ConversionLogger;
