import React from 'react';
import { useDispatch } from 'react-redux';

import * as Prototype from '@/ducks/prototype';
import { useEventualEngine } from '@/hooks';

export const useStartPrototype = () => {
  const dispatch = useDispatch();
  const getEngine = useEventualEngine();

  return React.useCallback((nodeID?: string | null) => {
    const engine = getEngine();
    return engine ? engine.prototype.start(nodeID) : dispatch(Prototype.startPrototype(nodeID));
  }, []);
};

export const useStartPublicPrototype = () => {
  const dispatch = useDispatch();
  const getEngine = useEventualEngine();

  return React.useCallback((nodeID?: string | null) => {
    const engine = getEngine();
    return engine ? engine.prototype.start(nodeID) : dispatch(Prototype.startPublicPrototype());
  }, []);
};

export const useResetPrototype = () => {
  const dispatch = useDispatch();
  const getEngine = useEventualEngine();

  return React.useCallback(() => {
    const engine = getEngine();

    return engine ? engine.prototype.reset() : dispatch(Prototype.resetPrototype());
  }, []);
};
