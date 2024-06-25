import type { NonNullishRecord } from '@voiceflow/common';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import type { State } from '@/store/types';

export interface ActiveProjectContext {
  workspaceID: string | null;
  projectID: string | null;
}

export const getActiveProjectContext = (state: State): NonNullishRecord<ActiveProjectContext> => {
  const workspaceID = Session.activeWorkspaceIDSelector(state);
  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertWorkspaceID(workspaceID);
  Errors.assertProjectID(projectID);

  return { workspaceID, projectID };
};
