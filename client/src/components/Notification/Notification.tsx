import qs from 'query-string';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Nullable, QueryParam } from 'src/core';
import useQueryParams from 'src/core/hooks/useQueryParams';

import Toast, { Props as ToastProps, Variant } from './components/Toast';

type ToastType = Omit<ToastProps, 'onClose'>;

type NotifyFn = (message: string) => void;

interface ContextValue {
  success: NotifyFn;
  warning: NotifyFn;
  error: NotifyFn;
  info: NotifyFn;
}

const initialValue = {
  success: () => null,
  warning: () => null,
  error: () => null,
  info: () => null,
};

export const NotificationContext = createContext<ContextValue>(initialValue);

export const useNotification: () => ContextValue = () =>
  useContext(NotificationContext);

const Notification: React.FC = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const { tm, tv, ...rest } = useQueryParams<{
    [QueryParam.ToastVariant]: ToastType['variant'];
    [QueryParam.ToastMessage]: string;
  }>();

  const [toast, setToast] = useState<Nullable<ToastType>>(null);

  const notifyFnFactory = useCallback(
    (variant: Variant): NotifyFn =>
      (message) => {
        setToast({ variant, message });
      },
    [],
  );

  const value = useMemo(
    () => ({
      success: notifyFnFactory('success'),
      warning: notifyFnFactory('warning'),
      error: notifyFnFactory('error'),
      info: notifyFnFactory('info'),
    }),
    [notifyFnFactory],
  );

  useEffect(() => {
    if (tm != null) {
      const fn = value[tv ?? 'info'];
      fn(tm);
      history.replace({ ...location, search: qs.stringify(rest) });
    }
  }, [history, location, value, tm, tv, rest]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          variant={toast.variant}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};

export default Notification;
