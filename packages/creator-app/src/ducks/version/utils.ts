import { createStructuredSelector } from 'reselect';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { State } from '@/store/types';
import { NonNullableRecord } from '@/types';

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

export const getActiveVersionContext = (state: State): NonNullableRecord<ActiveVersionContext> => {
  const context = activeVersionContextSelector(state);

  Errors.assertWorkspaceID(context.workspaceID);
  Errors.assertProjectID(context.projectID);
  Errors.assertVersionID(context.versionID);

  return context as NonNullableRecord<ActiveVersionContext>;
};
