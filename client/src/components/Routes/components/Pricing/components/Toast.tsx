import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useNotification } from 'src/components/Notification';
import useOMSUser from 'src/core/hooks/useOMSUser';

const Toast: React.VFC = () => {
  const history = useHistory();
  const location = useLocation();
  const notification = useNotification();
  const user = useOMSUser();

  useEffect(() => {
    if (user == null) {
      return;
    }
    if (location.search?.includes('t=true')) {
      notification.info(
        user.pricing_tier != null
          ? 'This feature requires a different subscription.'
          : 'This feature requires a subscription.',
      );
      history.replace({ ...location, search: undefined });
    }
  }, [history, location, notification, user]);

  return null;
};

export default Toast;
