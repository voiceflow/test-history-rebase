import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';

import { useFeature } from './feature';
import { useRealtimeSelector } from './realtime';
import { useSelector } from './redux';

export const useActiveWorkspace = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const workspaceV1 = useSelector(Workspace.activeWorkspaceSelector);
  const workspaceRealtime = useRealtimeSelector((state) => RealtimeWorkspace.workspaceByIDSelector(state, { id: activeWorkspaceID }));

  return atomicActions.isEnabled ? workspaceRealtime : workspaceV1;
};

export const useIsOnPaidPlanSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const isOnPaidPlanV1 = useSelector(Workspace.isOnPaidPlanSelector);
  const isOnPaidPlanRealtime = useRealtimeSelector((state) => RealtimeWorkspace.workspaceIsOnPaidPlanByIDSelector(state, { id: activeWorkspaceID }));

  return atomicActions.isEnabled ? isOnPaidPlanRealtime : isOnPaidPlanV1;
};

export const useActiveWorkspaceCommentingMembersSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const membersV1 = useSelector(Workspace.activeWorkspaceCommentingMembersSelector);
  const membersRealtime = useRealtimeSelector((state) => RealtimeWorkspace.workspaceCommentingMembersByIDSelector(state, { id: activeWorkspaceID }));

  return atomicActions.isEnabled ? membersRealtime : membersV1;
};

export const useIsTemplateWorkspaceSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const isTemplateWorkspaceV1 = useSelector(Workspace.isTemplateWorkspaceSelector);
  const isTemplateWorkspaceRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.isTemplateWorkspaceByIDSelector(state, { id: activeWorkspaceID })
  );

  return atomicActions.isEnabled ? isTemplateWorkspaceRealtime : isTemplateWorkspaceV1;
};

export const useHasWorkspaceMemberSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const hasWorkspaceMemberV1 = useSelector(Workspace.hasWorkspaceMemberSelector);
  const hasWorkspaceMemberRealtime = useRealtimeSelector(
    (state) => (creatorID: number) => RealtimeWorkspace.hasWorkspaceMemberByIDAndCreatorIDSelector(state, { id: activeWorkspaceID, creatorID })
  );

  return atomicActions.isEnabled ? hasWorkspaceMemberRealtime : hasWorkspaceMemberV1;
};

export const useWorkspaceUserRoleSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const creatorID = useSelector(Account.userIDSelector)!;
  const userRoleV1 = useSelector(Workspace.userRoleSelector);
  const userRoleRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.workspaceUserRoleByIDAndCreatorIDSelector(state, { id: activeWorkspaceID, creatorID })
  );

  return atomicActions.isEnabled ? userRoleRealtime : userRoleV1;
};

export const useIsViewerOrLibraryRoleSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const creatorID = useSelector(Account.userIDSelector)!;
  const isViewerOrLibraryRoleV1 = useSelector(Workspace.isViewerOrLibraryRoleSelector);
  const isViewerOrLibraryRoleRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.workspaceIsViewerOrLibraryRoleByIDAndCreatorIDSelector(state, { id: activeWorkspaceID, creatorID })
  );

  return atomicActions.isEnabled ? isViewerOrLibraryRoleRealtime : isViewerOrLibraryRoleV1;
};
