import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { useFeature } from './feature';
import { useSelector } from './redux';

export const useActiveWorkspace = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const workspaceV1 = useSelector(Workspace.activeWorkspaceSelector);
  const workspaceRealtime = useSelector((state) => WorkspaceV2.workspaceByIDSelector(state, { id: activeWorkspaceID }));

  return atomicActions.isEnabled ? workspaceRealtime : workspaceV1;
};

export const useIsOnPaidPlanSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const isOnPaidPlanV1 = useSelector(Workspace.isOnPaidPlanSelector);
  const isOnPaidPlanRealtime = useSelector((state) => WorkspaceV2.workspaceIsOnPaidPlanByIDSelector(state, { id: activeWorkspaceID }));

  return atomicActions.isEnabled ? isOnPaidPlanRealtime : isOnPaidPlanV1;
};

export const useActiveWorkspaceCommentingMembersSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const membersV1 = useSelector(Workspace.activeWorkspaceCommentingMembersSelector);
  const membersRealtime = useSelector((state) => WorkspaceV2.workspaceCommentingMembersByIDSelector(state, { id: activeWorkspaceID }));

  return atomicActions.isEnabled ? membersRealtime : membersV1;
};

export const useIsTemplateWorkspaceSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const isTemplateWorkspaceV1 = useSelector(Workspace.isTemplateWorkspaceSelector);
  const isTemplateWorkspaceRealtime = useSelector((state) => WorkspaceV2.isTemplateWorkspaceByIDSelector(state, { id: activeWorkspaceID }));

  return atomicActions.isEnabled ? isTemplateWorkspaceRealtime : isTemplateWorkspaceV1;
};

export const useHasWorkspaceMemberSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const hasWorkspaceMemberV1 = useSelector(Workspace.hasWorkspaceMemberSelector);
  const hasWorkspaceMemberRealtime = useSelector(
    (state) => (creatorID: number) => WorkspaceV2.hasWorkspaceMemberByIDAndCreatorIDSelector(state, { id: activeWorkspaceID, creatorID })
  );

  return atomicActions.isEnabled ? hasWorkspaceMemberRealtime : hasWorkspaceMemberV1;
};

export const useWorkspaceUserRoleSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const creatorID = useSelector(Account.userIDSelector)!;
  const userRoleV1 = useSelector(Workspace.userRoleSelector);
  const userRoleRealtime = useSelector((state) => WorkspaceV2.workspaceUserRoleByIDAndCreatorIDSelector(state, { id: activeWorkspaceID, creatorID }));

  return atomicActions.isEnabled ? userRoleRealtime : userRoleV1;
};

export const useIsViewerOrLibraryRoleSelector = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const creatorID = useSelector(Account.userIDSelector)!;
  const isViewerOrLibraryRoleV1 = useSelector(Workspace.isViewerOrLibraryRoleSelector);
  const isViewerOrLibraryRoleRealtime = useSelector((state) =>
    WorkspaceV2.workspaceIsViewerOrLibraryRoleByIDAndCreatorIDSelector(state, { id: activeWorkspaceID, creatorID })
  );

  return atomicActions.isEnabled ? isViewerOrLibraryRoleRealtime : isViewerOrLibraryRoleV1;
};
