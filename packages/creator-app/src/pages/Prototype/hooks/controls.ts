import React from 'react';
import { useDispatch } from 'react-redux';

import * as Prototype from '@/ducks/prototype';

export const useStartPrototype = () => {
  const dispatch = useDispatch();

  return React.useCallback(() => dispatch(Prototype.startPrototype()), []);
};

export const useStartPublicPrototype = () => {
  const dispatch = useDispatch();

  return React.useCallback(() => dispatch(Prototype.startPublicPrototype()), []);
};

export const useResetPrototype = () => {
  const dispatch = useDispatch();

  return React.useCallback((options?: Prototype.ResetOptions) => dispatch(Prototype.resetPrototype(options)), []);
};
