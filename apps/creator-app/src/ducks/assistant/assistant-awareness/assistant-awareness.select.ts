import { createEmpty, denormalize } from 'normal-store';
import { createSelector } from 'reselect';

import { assistantIDParamSelector, createSubSelector } from '@/ducks/utils/selector';

import { root as assistantRoot } from '../selectors/root.select';
import { STATE_KEY } from './assistant-awareness.state';

export const root = createSubSelector(assistantRoot, STATE_KEY);

export const viewersByAssistantID = createSelector(root, assistantIDParamSelector, (state, assistantID) =>
  assistantID ? denormalize(state.viewers[assistantID] ?? createEmpty()) : []
);
