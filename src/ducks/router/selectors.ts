import { getLocation } from 'connected-react-router';
import { Location } from 'history';
import { createSelector } from 'reselect';

export const stateSelector = createSelector(
  [getLocation as any],
  (location: Location): Record<string, any> => (location.state && typeof location.state === 'object' ? location.state : {})
);
