import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Avatar, Members } from '@voiceflow/ui';
import React from 'react';

import { logo } from '@/assets';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import * as S from './styles';

interface MembersListProps {
  onRemove: (memberID: number) => void;
  memberIDs: number[];
  onChangeRoles: (memberID: number, roles: UserRole[]) => void;
  memberRolesMap: Partial<Record<number, UserRole[]>>;
}

const MembersList: React.FC<MembersListProps> = ({ memberIDs, onRemove, onChangeRoles, memberRolesMap }) => {
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const activeMembersMap = useSelector(WorkspaceV2.active.activeMembersMapSelector);
  const workspaceMembersCount = useSelector(WorkspaceV2.active.membersCountSelector);

  const membersToRender = React.useMemo(
    () =>
      memberIDs
        .map((id) => {
          const activeMember = activeMembersMap[id];
          const assistantRoles = memberRolesMap[id];

          return activeMember && assistantRoles && { ...activeMember, role: assistantRoles[0] };
        })
        .filter(Utils.array.isNotNullish),
    [memberIDs, memberRolesMap, activeMembersMap]
  );

  return !workspace ? null : (
    <>
      <S.Header border={!!membersToRender.length}>
        <Avatar image={workspace.image ?? logo} text={workspace.name} large squareRadius />

        <div>
          <S.Title>{workspace.name}</S.Title>
          <S.Subtitle>All {workspaceMembersCount} members have their default access</S.Subtitle>
        </div>
      </S.Header>

      <Members.List
        inset
        members={membersToRender}
        onRemove={(member) => onRemove(member.creator_id)}
        onChangeRoles={(member, roles) => onChangeRoles(member.creator_id, roles)}
        hideLastDivider
      />
    </>
  );
};

export default MembersList;
