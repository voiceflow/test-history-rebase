import { NonNullishRecord } from '@voiceflow/common';
import { createStructuredSelector } from 'reselect';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { duckLogger } from '@/ducks/utils';
import { State } from '@/store/types';

import { STATE_KEY } from './constants';

export const log = duckLogger.child(STATE_KEY);

export interface ActiveWorkspaceContext {
  workspaceID: string | null;
}

export const activeWorkspaceContextSelector = createStructuredSelector<State, ActiveWorkspaceContext>({
  workspaceID: Session.activeWorkspaceIDSelector,
});

export const getActiveWorkspaceContext = (state: State): NonNullishRecord<ActiveWorkspaceContext> => {
  const context = activeWorkspaceContextSelector(state);

  Errors.assertWorkspaceID(context.workspaceID);

  return context as NonNullishRecord<ActiveWorkspaceContext>;
};
