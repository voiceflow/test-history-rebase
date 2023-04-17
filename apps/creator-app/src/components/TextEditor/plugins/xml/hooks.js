import { useForceUpdate } from '@voiceflow/ui';
import React from 'react';

export const useHoveredXmlTag = (key, linkedKey, store) => {
  const [forceUpdate] = useForceUpdate();

  React.useEffect(() => {
    store.registerTag(key, linkedKey, forceUpdate);

    return () => {
      store.unRegisterTag(key, linkedKey);
    };
  }, [store, key, linkedKey]);

  return store.get('hoveredTagKey');
};
