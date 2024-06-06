import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, Modal, SectionV2 } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as Assistant from '@/components/Assistant';
import * as Workspace from '@/components/Workspace';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

import manager from '../../../manager';

interface Props {
  projectID: string;
}

const Members = manager.create<Props>('ProjectMembers', () => ({ api, type, opened, hidden, animated, projectID }) => {
  const projectMembers = useSelector(ProjectV2.membersByProjectIDSelector, { id: projectID });
  const workspaceMembers = useSelector(WorkspaceV2.active.members.membersSelector);

  const addMember = useDispatch(ProjectV2.addMember, projectID);
  const removeMember = useDispatch(ProjectV2.removeMember, projectID);
  const patchMemberRole = useDispatch(ProjectV2.patchMemberRole, projectID);

  const members = React.useMemo<Assistant.Member[]>(() => {
    if (!workspaceMembers || !projectMembers) return [];

    return projectMembers.allKeys
      .map((memberID) => {
        const projectMember = Normal.getOne(projectMembers, memberID);
        const workspaceMember = Normal.getOne(workspaceMembers, memberID);

        if (!projectMember || !workspaceMember) return null;

        return {
          ...workspaceMember,
          role: projectMember.role,
        };
      })
      .filter(Utils.array.isNotNullish);
  }, [projectMembers, workspaceMembers]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>
        Manage Agent Access
      </Modal.Header>

      <Box mx={32}>
        <Assistant.InviteMember
          onAdd={(member) => addMember({ role: member.role, creatorID: member.creator_id })}
          members={members}
        />
      </Box>

      <SectionV2.Divider offset={[20, 0]} />

      <Assistant.MembersList members={members} onRemove={removeMember} onChangeRole={patchMemberRole} />

      <SectionV2.Divider inset offset={[0, 16]} />

      <Modal.Body>
        <Workspace.TakenSeatsMessage small />
      </Modal.Body>

      <Modal.Footer>
        <Button variant={ButtonVariant.PRIMARY} onClick={api.onClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Members;
