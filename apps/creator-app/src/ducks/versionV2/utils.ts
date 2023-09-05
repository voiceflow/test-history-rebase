import { NonNullishRecord } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { createStructuredSelector } from 'reselect';

import * as Errors from '@/config/errors';
import { nluTypeSelector, platformSelector, projectTypeSelector } from '@/ducks/projectV2/selectors/active';
import * as Session from '@/ducks/session';
import { State } from '@/store/types';

export interface ActiveVersionContext {
  workspaceID: string | null;
  projectID: string | null;
  versionID: string | null;
}

export interface ActiveDomainContext extends ActiveVersionContext {
  domainID: string | null;
}

export interface ActivePlatformVersionContext extends ActiveVersionContext {
  nlu: Platform.Constants.NLUType;
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
}

export const activeVersionContextSelector = createStructuredSelector<State, ActiveVersionContext>({
  projectID: Session.activeProjectIDSelector,
  versionID: Session.activeVersionIDSelector,
  workspaceID: Session.activeWorkspaceIDSelector,
});

export const activeDomainContextSelector = createStructuredSelector<State, ActiveDomainContext>({
  domainID: Session.activeDomainIDSelector,
  projectID: Session.activeProjectIDSelector,
  versionID: Session.activeVersionIDSelector,
  workspaceID: Session.activeWorkspaceIDSelector,
});

export const activePlatformVersionContextSelector = createStructuredSelector<State, ActivePlatformVersionContext>({
  nlu: nluTypeSelector,
  type: projectTypeSelector,
  platform: platformSelector,
  projectID: Session.activeProjectIDSelector,
  versionID: Session.activeVersionIDSelector,
  workspaceID: Session.activeWorkspaceIDSelector,
});

export const assertVersionContext: (context: ActiveVersionContext) => asserts context is NonNullishRecord<ActiveVersionContext> = (context) => {
  Errors.assertWorkspaceID(context.workspaceID);
  Errors.assertProjectID(context.projectID);
  Errors.assertVersionID(context.versionID);
};

export const assertDomainContext: (context: ActiveDomainContext) => asserts context is NonNullishRecord<ActiveDomainContext> = (context) => {
  assertVersionContext(context);

  Errors.assertDomainID(context.domainID);
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

export const getActiveDomainContext = (state: State): NonNullishRecord<ActiveDomainContext> => {
  const context = activeDomainContextSelector(state);

  assertDomainContext(context);

  return context;
};

export const getActiveAssistantContext = (state: State) => {
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);

  return { assistantID: versionID };
};

export const getActivePlatformVersionContext = (state: State): NonNullishRecord<ActivePlatformVersionContext> => {
  const context = activePlatformVersionContextSelector(state);

  assertPlatformVersionContext(context);

  return context;
};
