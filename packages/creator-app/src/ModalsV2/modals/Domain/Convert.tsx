import { BlockText, Button, Modal, Select, toast } from '@voiceflow/ui';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks/redux';

import { useModal } from '../../hooks';
import manager from '../../manager';
import ConvertConfirm from './ConvertConfirm';

export interface Props {
  sourceProjectID: string;
}

const Convert = manager.create<Props>('DomainConvert', () => ({ api, type, opened, hidden, animated, sourceProjectID }) => {
  const allProjects = useSelector(ProjectV2.allProjectsSelector);
  const projectsMap = useSelector(ProjectV2.projectsMapSelector);
  const sourceProject = useSelector(ProjectV2.projectByIDSelector, { id: sourceProjectID });

  const covertConfirmModal = useModal(ConvertConfirm);

  const [targetProjectID, setTargetProjectID] = React.useState<string | null>(null);

  const targetProjects = React.useMemo(
    () => (!sourceProject ? [] : allProjects.filter((project) => project.type === sourceProject.type && project.id !== sourceProject.id)),
    [sourceProject]
  );

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
      <Modal.Header actions={<Modal.Header.CloseButton onClick={api.close} />}>Convert to Domain</Modal.Header>

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
          Next
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Convert;
