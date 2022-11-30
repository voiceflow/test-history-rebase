import { UserRole } from '@voiceflow/internal';
import { Avatar } from '@voiceflow/ui';
import React from 'react';

import { logo } from '@/assets';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import MemberRow from '@/pages/DashboardV2/components/MemberRow';

import InviteMember from '../InviteMember';
import * as S from './styles';

interface AssistantMembersListProps {
  inset?: boolean;
  onChange: (memberIDs: number[]) => void;
  memberIDs: number[];
}

const AssistantMembersList: React.FC<AssistantMembersListProps> = ({ inset, onChange, memberIDs }) => {
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const workspaceMembersCount = useSelector(WorkspaceV2.active.membersCountSelector);
  const workspaceActiveMembersMap = useSelector(WorkspaceV2.active.activeMembersMapSelector);

  const onAdd = (newMemberID: number) => onChange([...memberIDs, newMemberID]);

  const onChangeMemberRoles = (_memberID: number, _roles: UserRole[]) => {
    // TODO: implement
  };

  if (!workspace) return null;

  return (
    <>
      <InviteMember onAdd={onAdd} memberIDs={memberIDs} />

      <S.List inset={inset}>
        <S.ListHeader>
          <Avatar image={workspace.image ?? logo} text={workspace.name} large squareRadius />
          <div>
            <S.HeaderTitle>{workspace.name}</S.HeaderTitle>
            <S.HeaderSubtitle>All {workspaceMembersCount} members have their default access</S.HeaderSubtitle>
          </div>
        </S.ListHeader>

        {memberIDs.map(
          (memberID, index) =>
            workspaceActiveMembersMap[memberID] && (
              <MemberRow
                key={memberID}
                inset
                member={workspaceActiveMembersMap[memberID]}
                border={index + 1 !== memberIDs?.length}
                onChangeRoles={(roles) => onChangeMemberRoles(memberID, roles)}
              />
            )
        )}
      </S.List>
    </>
  );
};

export default AssistantMembersList;
