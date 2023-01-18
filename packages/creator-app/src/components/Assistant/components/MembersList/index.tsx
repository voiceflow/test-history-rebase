import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Avatar, Members } from '@voiceflow/ui';
import React from 'react';

import { logo } from '@/assets';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

import * as S from './styles';

interface MembersListProps {
  onRemove: (memberID: number) => void;
  memberIDs: number[];
  onChangeRoles: (memberID: number, roles: UserRole[]) => void;
  memberRolesMap: Partial<Record<number, UserRole[]>>;
}

const MembersList: React.FC<MembersListProps> = ({ memberIDs, onRemove, onChangeRoles, memberRolesMap }) => {
  const members = useSelector(WorkspaceV2.active.membersSelector);
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const allMembersCount = useSelector(WorkspaceV2.active.allNormalizedMembersCountSelector);

  const membersToRender = React.useMemo(
    () =>
      memberIDs
        .map((id) => {
          const member = members?.byKey[id];
          const assistantRoles = memberRolesMap[id];

          if (!member || !assistantRoles) return null;

          return { ...member, role: assistantRoles[0] };
        })
        .filter(Utils.array.isNotNullish),
    [memberIDs, memberRolesMap, members]
  );

  return !workspace ? null : (
    <>
      <S.Header border={!!membersToRender.length}>
        <Avatar image={workspace.image ?? logo} text={workspace.name} large squareRadius />

        <div>
          <S.Title>{workspace.name}</S.Title>
          <S.Subtitle>All {allMembersCount} members have their default access</S.Subtitle>
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
