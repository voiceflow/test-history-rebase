import { UserRole } from '@voiceflow/internal';
import { Button, Flex, Members } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { Identifier } from '@/styles/constants';

interface InviteMemberProps {
  onAdd: (member: number) => void;
  memberIDs: number[];
}

const InviteMember: React.OldFC<InviteMemberProps> = ({ onAdd: onAddProp, memberIDs }) => {
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
    <Flex gap={12} fullWidth>
      <SelectInputGroup
        renderInput={({ leftAction, ...props }) => (
          <Members.Select {...props} value={memberID} members={membersToAdd} onChange={setMemberID} fullWidth />
        )}
      >
        {() => (!memberID ? <></> : <Members.RoleSelect roles={roles} onChange={setRoles} />)}
      </SelectInputGroup>

      <Button id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onAdd} disabled={memberID === null} variant={Button.Variant.PRIMARY}>
        Add
      </Button>
    </Flex>
  );
};

export default InviteMember;
