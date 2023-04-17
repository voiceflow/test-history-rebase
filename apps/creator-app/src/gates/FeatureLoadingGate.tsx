import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Feature from '@/ducks/feature';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

const FeatureLoadingGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isLoaded = useSelector(Feature.isLoadedSelector);
  const loadFeatures = useDispatch(Feature.loadFeatures);

  return (
    <LoadingGate label="Features" internalName={FeatureLoadingGate.name} isLoaded={isLoaded} load={loadFeatures}>
      {children}
    </LoadingGate>
  );
};

export default FeatureLoadingGate;
