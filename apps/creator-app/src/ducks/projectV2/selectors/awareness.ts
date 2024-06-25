import type { Nullish } from '@voiceflow/common';
import { createSelector } from 'reselect';

import { idParamSelector } from '@/ducks/utils/crudV2';

import { rootProjectsSelector } from './base';

export const awarenessStateSelector = createSelector([rootProjectsSelector], (state) => state.awareness);

export const awarenessViewersSelector = createSelector([awarenessStateSelector], (awareness) => awareness.viewers);

export const awarenessViewersByIDSelector = createSelector(
  [awarenessViewersSelector, idParamSelector],
  (viewers, projectID) => (projectID ? viewers[projectID] : null)
);

export const getAwarenessViewersByIDSelector = createSelector(
  [awarenessViewersSelector],
  (viewers) =>
    ({ id }: { id: Nullish<string> }) =>
      id ? viewers[id] : null
);
