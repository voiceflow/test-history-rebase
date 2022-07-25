import { NonNullishRecord } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createStructuredSelector } from 'reselect';

import * as Errors from '@/config/errors';
import { platformSelector } from '@/ducks/projectV2/selectors/active';
import * as Session from '@/ducks/session';
import { State } from '@/store/types';

export interface ActiveVersionContext {
  workspaceID: string | null;
  projectID: string | null;
  versionID: string | null;
}

export interface ActivePlatformVersionContext extends ActiveVersionContext {
  platform: VoiceflowConstants.PlatformType;
}

export const activeVersionContextSelector = createStructuredSelector<State, ActiveVersionContext>({
  workspaceID: Session.activeWorkspaceIDSelector,
  projectID: Session.activeProjectIDSelector,
  versionID: Session.activeVersionIDSelector,
});

export const activePlatformVersionContextSelector = createStructuredSelector<State, ActivePlatformVersionContext>({
  workspaceID: Session.activeWorkspaceIDSelector,
  projectID: Session.activeProjectIDSelector,
  versionID: Session.activeVersionIDSelector,
  platform: platformSelector,
});

export const assertVersionContext: (context: ActiveVersionContext) => asserts context is NonNullishRecord<ActiveVersionContext> = (context) => {
  Errors.assertWorkspaceID(context.workspaceID);
  Errors.assertProjectID(context.projectID);
  Errors.assertVersionID(context.versionID);
};

export const assertPlatformVersionContext: (
  context: ActivePlatformVersionContext
) => asserts context is NonNullishRecord<ActivePlatformVersionContext> = (context) => {
  assertVersionContext(context);

  Errors.assertPlatform(context.platform);
};

export const getActiveVersionContext = (state: State): NonNullishRecord<ActiveVersionContext> => {
  const context = activeVersionContextSelector(state);

  assertVersionContext(context);

  return context;
};

export const getActivePlatformVersionContext = (state: State): NonNullishRecord<ActivePlatformVersionContext> => {
  const context = activePlatformVersionContextSelector(state);

  assertPlatformVersionContext(context);

  return context;
};
