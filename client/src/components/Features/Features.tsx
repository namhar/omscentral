import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useFeaturesQuery from 'src/core/hooks/useFeaturesQuery';
import useOMSUser from 'src/core/hooks/useOMSUser';
import { Feature } from 'src/graphql';

import { satisfiesPricingTierCondition } from './Features.utils';

interface ContextValue {
  initializing: boolean;
  features: Feature[];
  isEnabled: (alias: string) => boolean;
}

const initialValue: ContextValue = {
  initializing: true,
  features: [],
  isEnabled: () => false,
};

export const FeaturesContext = createContext<ContextValue>(initialValue);

export const useFeatures: () => ContextValue = () =>
  useContext(FeaturesContext);

const Features: React.FC = ({ children }) => {
  const [value, setValue] = useState<ContextValue>(initialValue);

  const { loading, features } = useFeaturesQuery();

  const user = useOMSUser();

  /**
   * @returns True if feature is turned on and available for the user.
   */
  const isEnabled = useCallback(
    (alias: string) =>
      features.some(
        (feature) =>
          feature.alias === alias &&
          feature.status === 'on' &&
          satisfiesPricingTierCondition(feature, user),
      ),
    [features, user],
  );

  useEffect(() => {
    setValue({
      initializing: loading,
      features,
      isEnabled,
    });
  }, [loading, features, isEnabled]);

  return (
    <FeaturesContext.Provider value={value}>
      {children}
    </FeaturesContext.Provider>
  );
};

export default Features;
