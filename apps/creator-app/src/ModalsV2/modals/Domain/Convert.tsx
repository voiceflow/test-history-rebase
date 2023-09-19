import { BlockText, Button, Modal, Select } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import * as Normal from 'normal-store';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import { useCreateIdentity } from '@/hooks/identity';
import { getIdentityPermission, usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';

import { useModal } from '../../hooks';
import manager from '../../manager';
import ConvertConfirm from './ConvertConfirm';

export interface Props {
  sourceProjectID: string;
}

const Convert = manager.create<Props>('DomainConvert', () => ({ api, type, opened, hidden, animated, sourceProjectID }) => {
  const userID = useSelector(Account.userIDSelector)!;
  const allProjects = useSelector(ProjectV2.allProjectsSelector);
  const projectsMap = useSelector(ProjectV2.projectsMapSelector);
  const sourceProject = useSelector(ProjectV2.projectByIDSelector, { id: sourceProjectID });

  const createIdentity = useCreateIdentity();
  const covertConfirmModal = useModal(ConvertConfirm);
  const [canManageProjects] = usePermission(Permission.PROJECTS_MANAGE);

  const [targetProjectID, setTargetProjectID] = React.useState<string | null>(null);

  const targetProjects = React.useMemo(() => {
    if (!sourceProject) return [];

    return allProjects.filter((project) => {
      if (project.type !== sourceProject.type || project.id === sourceProject.id) return false;
      if (canManageProjects) return true;

      const projectMember = Normal.getOne(project.members, String(userID));

      if (!projectMember) return false;

      const identity = createIdentity({ projectID: project.id, activeRole: projectMember.role, projectRole: projectMember.role });

      return getIdentityPermission(identity, Permission.PROJECT_EDIT).allowed;
    });
  }, [userID, createIdentity, sourceProject, canManageProjects]);

  const onConvert = () => {
    if (!targetProjectID) {
      toast.error('Please select a target assistant.');
      return;
    }

    covertConfirmModal.openVoid({ sourceProjectID, targetProjectID });
    api.close();
  };

  return (
    <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />} capitalizeText={false}>
        Convert to Domain
      </Modal.Header>

      <Modal.Body>
        <BlockText mb={16}>Select the Assistant that you’d like to merge this domain into.</BlockText>

        <Select
          value={targetProjectID}
          options={targetProjects}
          onSelect={setTargetProjectID}
          clearable={!!targetProjectID}
          placeholder="Select assistant"
          getOptionKey={(option) => option.id}
          getOptionValue={(option) => option?.id}
          getOptionLabel={(value) => value && projectsMap[value]?.name}
          clearOnSelectActive
        />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button onClick={onConvert} disabled={!targetProjectID} squareRadius>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Convert;
