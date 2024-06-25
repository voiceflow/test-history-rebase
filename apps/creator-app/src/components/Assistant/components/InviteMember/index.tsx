import { Utils } from '@voiceflow/common';
import type { ProjectUserRole } from '@voiceflow/dtos';
import { UserRole } from '@voiceflow/dtos';
import { Button, Flex, Members } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { Identifier } from '@/styles/constants';

import type { Member } from '../../types';

interface InviteMemberProps {
  onAdd: (member: Member) => void;
  members: Member[];
}

const InviteMember: React.FC<InviteMemberProps> = ({ onAdd: onAddProp, members }) => {
  const workspaceMembers = useSelector(WorkspaceV2.active.members.membersListSelector);

  const [role, setRole] = React.useState<ProjectUserRole>(UserRole.EDITOR);
  const [memberID, setMemberID] = React.useState<number | null>(null);

  const onAdd = () => {
    if (memberID === null) return;

    const member = workspaceMembers.find((member) => member.creator_id === memberID);

    if (!member) return;

    onAddProp({ ...member, role });
    setMemberID(null);
  };

  const membersToAdd = React.useMemo(() => {
    const membersMap = Utils.array.createMap(members, (member) => member.creator_id);

    return workspaceMembers
      .filter((workspaceMember) => !membersMap[workspaceMember.creator_id])
      .map((member) => ({ ...member, projects: [] }));
  }, [members, workspaceMembers]);

  return (
    <Flex gap={12} fullWidth>
      <SelectInputGroup
        overflowHidden={false}
        renderInput={({ leftAction, ...props }) => (
          <Members.Select {...props} value={memberID} members={membersToAdd} onChange={setMemberID} fullWidth />
        )}
      >
        {() =>
          !memberID ? (
            <></>
          ) : (
            <Members.RoleSelect value={role} roles={[UserRole.EDITOR, UserRole.VIEWER]} onChange={setRole} />
          )
        }
      </SelectInputGroup>

      <Button
        id={Identifier.COLLAB_SEND_INVITE_BUTTON}
        onClick={onAdd}
        disabled={memberID === null}
        variant={Button.Variant.PRIMARY}
      >
        Add
      </Button>
    </Flex>
  );
};

export default InviteMember;
