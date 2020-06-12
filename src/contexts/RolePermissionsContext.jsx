import React from 'react';

import { FEATURE_PLAN_PERMISSIONS, FEATURE_ROLE_PERMISSIONS } from '@/constants';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';

export const RolePermissionsContext = React.createContext();

const PermissionsProvider = ({ userId, activeWorkspaceMembers, currentWorkspacePlan, children }) => {
  const creatorMember = activeWorkspaceMembers.find((member) => {
    return member.creator_id === userId;
  });
  const userRole = creatorMember?.role;

  return <RolePermissionsContext.Provider value={{ userRole, workspacePlan: currentWorkspacePlan }}>{children}</RolePermissionsContext.Provider>;
};

export const usePermissions = (featureId) => {
  const { userRole, workspacePlan } = React.useContext(RolePermissionsContext) || {};
  const hasPlanPermission = !FEATURE_PLAN_PERMISSIONS[featureId] || FEATURE_PLAN_PERMISSIONS[featureId].includes(workspacePlan);

  const canUse = FEATURE_ROLE_PERMISSIONS[featureId]?.includes(userRole) && hasPlanPermission;

  return [canUse, userRole];
};

const mapStateToProps = {
  activeWorkspaceMembers: Workspace.activeWorkspaceMembersSelector,
  currentWorkspacePlan: Workspace.planTypeSelector,
  userId: Account.userIDSelector,
};

export const RolePermissionsProvider = connect(mapStateToProps)(PermissionsProvider);
