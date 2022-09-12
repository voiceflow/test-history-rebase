import React from 'react';
import { useDispatch } from 'react-redux';

import * as Prototype from '@/ducks/prototype';

export const useStartPrototype = () => {
  const dispatch = useDispatch();

  return React.useCallback((nodeID?: string | null) => dispatch(Prototype.startPrototype(nodeID)), []);
};

export const useStartPublicPrototype = () => {
  const dispatch = useDispatch();

  return React.useCallback(() => dispatch(Prototype.startPublicPrototype()), []);
};

export const useResetPrototype = () => {
  const dispatch = useDispatch();

  return React.useCallback(() => dispatch(Prototype.resetPrototype()), []);
};
