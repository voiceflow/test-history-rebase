import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, Modal, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Assistant from '@/components/Assistant';
import Workspace from '@/components/Workspace';

import manager from '../../../manager';

const Members = manager.create('ProjectMembers', () => ({ api, type, opened, hidden, animated }) => {
  // FIXME: We don't have a list of assistant members yet, once we do, we need to use it here.
  const [memberIDs, setMembers] = React.useState<number[]>([]);
  const [memberRolesMap, setMemberRolesMap] = React.useState<Partial<Record<number, UserRole[]>>>({});

  // FIXME: Move to redux side effects to reuse in the assistant create modal
  const onAdd = (memberID: number) => {
    setMembers([...memberIDs, memberID]);
    setMemberRolesMap({ ...memberRolesMap, [memberID]: [UserRole.EDITOR] });
  };

  // FIXME: Move to redux side effects to reuse in the assistant create modal
  const onRemove = (memberID: number) => {
    setMembers(memberIDs.filter((id) => id !== memberID));
    setMemberRolesMap(Utils.object.omit(memberRolesMap, [memberID]));
  };

  // FIXME: Move to redux side effects to reuse in the assistant create modal
  const onChangeRoles = (memberID: number, roles: UserRole[]) => {
    setMemberRolesMap({ ...memberRolesMap, [memberID]: roles });
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
      <Modal.Header>Manage Assistant Access</Modal.Header>

      <Box mx={32}>
        <Assistant.InviteMember onAdd={onAdd} memberIDs={memberIDs} />
      </Box>

      <SectionV2.Divider offset={[20, 0]} />

      <Assistant.MembersList memberIDs={memberIDs} memberRolesMap={memberRolesMap} onRemove={onRemove} onChangeRoles={onChangeRoles} />

      <SectionV2.Divider inset offset={[0, 16]} />

      <Modal.Body>
        <Workspace.TakenSeatsMessage small />
      </Modal.Body>

      <Modal.Footer gap={10}>
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={() => api.close()}>
          Cancel
        </Button>

        <Button variant={ButtonVariant.PRIMARY}>Invite & Pay</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Members;
