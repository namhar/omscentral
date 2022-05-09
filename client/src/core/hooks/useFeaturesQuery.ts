import { useMemo } from 'react';
import { Feature, useFeaturesQuery as useFeaturesQ } from 'src/graphql';

const useFeaturesQuery = (): Readonly<{
  loading: boolean;
  features: Feature[];
}> => {
  const { loading, data } = useFeaturesQ();

  return useMemo(
    () => ({
      loading,
      features: data?.features ?? [],
    }),
    [loading, data],
  );
};

export default useFeaturesQuery;
