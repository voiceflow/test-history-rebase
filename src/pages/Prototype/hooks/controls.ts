import React from 'react';
import { useDispatch } from 'react-redux';

import { EventualEngineContext } from '@/contexts';
import * as Prototype from '@/ducks/prototype';

export const useStartPrototype = () => {
  const dispatch = useDispatch();
  const eventualEngine = React.useContext(EventualEngineContext);

  return React.useCallback((diagramID?: string | null, nodeID?: string | null) => {
    const engine = eventualEngine?.get();

    return engine ? engine.prototype.start(diagramID, nodeID) : dispatch(Prototype.startPrototype(diagramID, nodeID));
  }, []);
};

export const useResetPrototype = () => {
  const dispatch = useDispatch();
  const eventualEngine = React.useContext(EventualEngineContext);

  return React.useCallback(() => {
    const engine = eventualEngine?.get();

    return engine ? engine.prototype.reset() : dispatch(Prototype.resetPrototype());
  }, []);
};
