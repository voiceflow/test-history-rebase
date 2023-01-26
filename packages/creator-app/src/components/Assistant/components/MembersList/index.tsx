import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Avatar, Members, TippyTooltip } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import { vfLogo } from '@/assets';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { isEditorUserRole } from '@/utils/role';

import type { Member } from '../../types';
import * as S from './styles';

interface MembersListProps {
  members: Member[];
  onRemove: (memberID: number) => void;
  onChangeRole: (memberID: number, role: Member['role']) => void;
}

const ROLES = [UserRole.EDITOR, UserRole.VIEWER] satisfies UserRole[];

const MembersList: React.FC<MembersListProps> = ({ members, onRemove, onChangeRole }) => {
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const allMembersCount = useSelector(WorkspaceV2.active.allNormalizedMembersCountSelector);
  const getWorkspaceMemberByID = useSelector(WorkspaceV2.active.getMemberByIDSelector);

  const conflictingMemberRolesMap = React.useMemo(
    () =>
      Object.fromEntries(
        members.map((member) => {
          const workspaceMember = getWorkspaceMemberByID({ creatorID: member.creator_id });

          return [
            member.creator_id,
            !!workspaceMember &&
              isEditorUserRole(member.role) !== isEditorUserRole(workspaceMember.role) &&
              Realtime.Utils.role.isRoleAStrongerRoleB(workspaceMember.role, member.role),
          ];
        })
      ),
    [members, getWorkspaceMemberByID]
  );

  return !workspace ? null : (
    <>
      <S.Header border={!!members.length}>
        <Avatar image={workspace.image ?? vfLogo} text={workspace.name} large squareRadius />

        <div>
          <S.Title>{workspace.name}</S.Title>
          <S.Subtitle>All {pluralize('member', allMembersCount, true)} have their default access</S.Subtitle>
        </div>
      </S.Header>

      <div>
        {members.map((member, index) => (
          <Members.Row<Member>
            key={member.email}
            inset
            roles={ROLES}
            border={index + 1 !== members.length}
            member={member}
            onRemove={onRemove && (() => onRemove(member.creator_id))}
            onChangeRole={onChangeRole && ((role) => onChangeRole(member.creator_id, role))}
            warningTooltip={
              conflictingMemberRolesMap[member.creator_id]
                ? {
                    width: 232,
                    placement: 'bottom',
                    content: (
                      <TippyTooltip.Multiline>
                        This member can still edit this assistant as they have edit access at the workspace level.
                      </TippyTooltip.Multiline>
                    ),
                  }
                : null
            }
          />
        ))}
      </div>
    </>
  );
};

export default MembersList;
