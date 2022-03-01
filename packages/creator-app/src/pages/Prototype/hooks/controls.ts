import React from 'react';
import { useDispatch } from 'react-redux';

import * as Prototype from '@/ducks/prototype';
import { useEventualEngine } from '@/hooks';

export const useStartPrototype = () => {
  const dispatch = useDispatch();
  const getEngine = useEventualEngine();

  return React.useCallback((diagramID?: string | null, nodeID?: string | null) => {
    const engine = getEngine();
    return engine ? engine.prototype.start(diagramID, nodeID) : dispatch(Prototype.startPrototype(diagramID, nodeID));
  }, []);
};

export const useStartPublicPrototype = () => {
  const dispatch = useDispatch();
  const getEngine = useEventualEngine();

  return React.useCallback((diagramID?: string | null, nodeID?: string | null) => {
    const engine = getEngine();
    return engine ? engine.prototype.start(diagramID, nodeID) : dispatch(Prototype.startPublicPrototype());
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
