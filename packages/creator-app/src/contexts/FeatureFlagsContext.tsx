import React from 'react';
import { useSelector } from 'react-redux';

import * as Feature from '@/ducks/feature';

export const FeatureFlagsContext = React.createContext<Feature.FeatureFlagMap>({});

export const { Consumer: FeatureFlagsConsumer } = FeatureFlagsContext;

export const FeatureFlagsProvider: React.FC = ({ children }) => {
  const features = useSelector(Feature.featuresSelector);

  return <FeatureFlagsContext.Provider value={features}>{children}</FeatureFlagsContext.Provider>;
};
