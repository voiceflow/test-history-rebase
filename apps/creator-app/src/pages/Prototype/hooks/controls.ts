import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useStore } from '@/hooks/redux';

export const useStartPrototype = () => {
  const store = useStore();

  return React.useCallback(() => store.dispatch(Prototype.startPrototype()), []);
};

export const useStartPublicPrototype = (settings: Prototype.PrototypeSettings) => {
  const store = useStore();

  return React.useCallback(() => store.dispatch(Prototype.startPublicPrototype(settings)), []);
};

export const useResetPrototype = () => {
  const store = useStore();

  return React.useCallback((options?: Prototype.ResetOptions) => store.dispatch(Prototype.resetPrototype(options)), []);
};
