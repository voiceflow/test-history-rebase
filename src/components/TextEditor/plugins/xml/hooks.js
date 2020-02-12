import React from 'react';

import { useForceUpdate } from '@/hooks';

// eslint-disable-next-line import/prefer-default-export
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
