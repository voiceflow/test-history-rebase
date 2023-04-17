import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useStore } from '@/hooks/redux';

export const useStartPrototype = () => {
  const store = useStore();

  return React.useCallback(() => store.dispatch(Prototype.startPrototype()), []);
};

export const useStartPublicPrototype = () => {
  const store = useStore();

  return React.useCallback(() => store.dispatch(Prototype.startPublicPrototype()), []);
};

export const useResetPrototype = () => {
  const store = useStore();

  return React.useCallback((options?: Prototype.ResetOptions) => store.dispatch(Prototype.resetPrototype(options)), []);
};
