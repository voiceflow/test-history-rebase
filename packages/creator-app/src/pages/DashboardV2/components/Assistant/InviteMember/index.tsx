import { UserRole } from '@voiceflow/internal';
import { Button, Flex } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import RoleSelect from '../../RoleSelect';
import WorkspaceMemberSelect from '../../Workspace/MemberSelect';
import * as S from './styles';

interface AssistantInviteMemberProps {
  onAdd: (memberID: number) => void;
  memberIDs: number[];
}

const AssistantInviteMember: React.FC<AssistantInviteMemberProps> = ({ onAdd: onAddProp, memberIDs }) => {
  const workspaceActiveMembers = useSelector(WorkspaceV2.active.activeMembersSelector);

  const [roles, setRoles] = React.useState<UserRole[]>([UserRole.EDITOR]);
  const [memberID, setMemberID] = React.useState<number | null>(null);

  const onAdd = () => {
    if (memberID === null) return;

    onAddProp(memberID);
    setMemberID(null);
  };

  const membersToAdd = React.useMemo(
    () => workspaceActiveMembers.filter((member) => !memberIDs.includes(member.creator_id)),
    [memberIDs, workspaceActiveMembers]
  );

  return (
    <S.Container>
      <Flex gap={12} fullWidth>
        <SelectInputGroup
          renderInput={({ leftAction, ...props }) => (
            <WorkspaceMemberSelect {...props} value={memberID} members={membersToAdd} onChange={setMemberID} fullWidth />
          )}
        >
          {() => <RoleSelect roles={roles} onChange={setRoles} />}
        </SelectInputGroup>

        <S.Button id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onAdd} disabled={memberID === null} variant={Button.Variant.PRIMARY}>
          Add
        </S.Button>
      </Flex>
    </S.Container>
  );
};

export default AssistantInviteMember;
