import React from 'react';

import { FEATURE_PERMISSIONS } from '@/constants';
import { userIDSelector } from '@/ducks/account';
import { activeWorkspaceMembersSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';

export const RolePermissionsContext = React.createContext();

const PermissionsProvider = ({ userId, activeWorkspaceMembers, children }) => {
  const creatorMember = activeWorkspaceMembers.find((member) => {
    return member.creator_id === userId;
  });
  const userRole = creatorMember?.role;
  return <RolePermissionsContext.Provider value={{ userRole }}>{children}</RolePermissionsContext.Provider>;
};

export const usePermissions = (featureId) => {
  const { userRole } = React.useContext(RolePermissionsContext) || {};

  const canUse = React.useMemo(() => FEATURE_PERMISSIONS[featureId].includes(userRole), [userRole, featureId]);

  return [canUse, userRole];
};

const mapStateToProps = {
  activeWorkspaceMembers: activeWorkspaceMembersSelector,
  userId: userIDSelector,
};

export const RolePermissionsProvider = connect(mapStateToProps)(PermissionsProvider);
