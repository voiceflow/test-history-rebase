import React from 'react';

import MergePreview from './components/MergePreview';
import { useMergeLayerAPI, useMergeLayerSubscription } from './hooks';

const MergeLayer: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const api = useMergeLayerAPI(ref);

  useMergeLayerSubscription(api);

  return <MergePreview isVisible={api.isVisible} ref={api.ref} />;
};

export default MergeLayer;
