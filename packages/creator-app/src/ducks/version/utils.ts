import { NonNullishRecord } from '@voiceflow/common';
import { createStructuredSelector } from 'reselect';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { State } from '@/store/types';

export interface ActiveVersionContext {
  workspaceID: string | null;
  projectID: string | null;
  versionID: string | null;
}

export const activeVersionContextSelector = createStructuredSelector<State, ActiveVersionContext>({
  workspaceID: Session.activeWorkspaceIDSelector,
  projectID: Session.activeProjectIDSelector,
  versionID: Session.activeVersionIDSelector,
});

export const assertVersionContext: (context: ActiveVersionContext) => asserts context is NonNullishRecord<ActiveVersionContext> = (context) => {
  Errors.assertWorkspaceID(context.workspaceID);
  Errors.assertProjectID(context.projectID);
  Errors.assertVersionID(context.versionID);
};

export const getActiveVersionContext = (state: State): NonNullishRecord<ActiveVersionContext> => {
  const context = activeVersionContextSelector(state);

  assertVersionContext(context);

  return context;
};
