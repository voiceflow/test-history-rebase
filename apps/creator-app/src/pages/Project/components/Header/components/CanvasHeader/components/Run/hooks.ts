import React from 'react';

import * as Router from '@/ducks/router';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useTrackingEvents } from '@/hooks';

export const useRunPrototype = () => {
  const goToPrototype = useDispatch(Router.goToCurrentPrototype);
  const defaultVariableState = useDispatch(VariableState.defaultVariableState);

  const [, trackingEventsWrapper] = useTrackingEvents();

  return React.useCallback(
    trackingEventsWrapper(() => {
      defaultVariableState();
      goToPrototype();
    }, 'trackActiveProjectPrototypeTestClick'),
    []
  );
};
