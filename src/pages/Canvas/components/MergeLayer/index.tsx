import React from 'react';

import { useRegistration } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';

import MergePreview from './components/MergePreview';
import { useMergeLayerAPI } from './hooks';

const MergeLayer: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const engine = React.useContext(EngineContext)!;
  const api = useMergeLayerAPI(ref);

  useRegistration(() => engine.merge.register('mergeLayer', api), [api]);

  return <MergePreview isVisible={api.isVisible} isTransparent={api.isTransparent} ref={api.ref} />;
};

export default MergeLayer;
