import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Menu } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useFeature, useSelector } from '@/hooks';

import * as S from './styles';

interface PermissionDropdownProps {
  member: Realtime.WorkspaceMember | Realtime.PendingWorkspaceMember;
  inline?: boolean;
}

const PermissionDropdown: React.FC<PermissionDropdownProps> = ({ member, inline }) => {
  const role = useSelector(WorkspaceV2.active.userRoleSelector);
  const userID = useSelector(Account.userIDSelector);
  const activeWorkspace = useActiveWorkspace();

  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const changePermission = (role: UserRole) => updateMemberRole(member, role);

  const isPending = !member.creator_id;
  const userIsMember = userID === member.creator_id;
  const memberIsWorkspaceOwner = activeWorkspace?.creatorID && member.creator_id && activeWorkspace?.creatorID === member.creator_id;
  const allowDropdown =
    !userIsMember && !memberIsWorkspaceOwner && !(role === UserRole.EDITOR && (member.role === UserRole.OWNER || member.role === UserRole.ADMIN));

  const ownerRole = useFeature(Realtime.FeatureFlag.OWNER_ROLE);

  const remove = () => {
    if (!member.creator_id) {
      cancelInvite(member.email);
    } else {
      deleteMember(member.creator_id);
    }
  };

  return (
    <S.Dropdown
      placement={inline ? 'bottom-end' : 'bottom-start'}
      menu={
        <Menu>
          <>
            <Menu.Item onClick={() => changePermission(UserRole.EDITOR)} active={member.role === UserRole.EDITOR}>
              {UserRole.EDITOR}
            </Menu.Item>
            <Menu.Item onClick={() => changePermission(UserRole.VIEWER)} active={member.role === UserRole.VIEWER}>
              {UserRole.VIEWER}
            </Menu.Item>
          </>
          {(role === UserRole.OWNER || role === UserRole.ADMIN) && ownerRole.isEnabled && (
            <>
              <Menu.Item onClick={() => changePermission(UserRole.OWNER)} active={member.role === UserRole.OWNER}>
                {UserRole.OWNER}
              </Menu.Item>
            </>
          )}
          {role === UserRole.ADMIN && (
            <>
              <Menu.Item onClick={() => changePermission(UserRole.ADMIN)} active={member.role === UserRole.ADMIN}>
                {UserRole.ADMIN}
              </Menu.Item>
              <Menu.Item onClick={() => changePermission(UserRole.BILLING)} active={member.role === UserRole.BILLING}>
                {UserRole.BILLING}
              </Menu.Item>
            </>
          )}
          <Menu.Item divider />

          {isPending && <Menu.Item onClick={() => sendInvite(member.email, null)}>Resend Invite</Menu.Item>}
          <Menu.Item onClick={remove}>{isPending ? 'Cancel Invite' : 'Remove Access'}</Menu.Item>
        </Menu>
      }
    >
      {(ref, onToggle) => (
        <S.Trigger ref={ref} onClick={() => onToggle()} disabled={!allowDropdown}>
          {member.role}
          {allowDropdown && <S.TriggerCarret />}
        </S.Trigger>
      )}
    </S.Dropdown>
  );
};

export default PermissionDropdown;
