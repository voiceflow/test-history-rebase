import { Box, Button, Input, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

import manager from '../../manager';

interface Props {
  projectID: string;
  boardID?: string;
}

const Delete = manager.create<Props>('ProjectDelete', () => ({ api, type, opened, hidden, animated, projectID, boardID }) => {
  const [confirmName, setConfirmName] = React.useState('');

  const project = useSelector(ProjectV2.projectByIDSelector, { id: projectID });

  const onDeleteProject = useDispatch(Project.deleteProject);
  const onDeleteProjectFromList = useDispatch(ProjectList.deleteProjectFromList);
  const onGoToDashboard = useDispatch(Router.goToDashboard);

  const [trackingEvents] = useTrackingEvents();

  const onDelete = async () => {
    if (!project) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
    }

    try {
      trackingEvents.trackProjectDelete({ versionID: project?.versionID, projectID });

      if (boardID) {
        await onDeleteProjectFromList(boardID, projectID);
      } else {
        await onDeleteProject(projectID);
        onGoToDashboard();
      }
      api.close();
      toast.success(`Successfully deleted ${project?.name}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
      <Modal.Header actions={<Modal.Header.CloseButton onClick={api.close} />}>Delete Assistant</Modal.Header>

      <Modal.Body centered>
        <Box.FlexCenter pb={16}>
          Your assistant will be permanently deleted with no chance of recovery. Type the assistant name in the input below to confirm.
        </Box.FlexCenter>
        <Input placeholder={project?.name || ''} value={confirmName} onChangeText={(value) => setConfirmName(value)} />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button squareRadius onClick={onDelete} disabled={confirmName !== project?.name}>
          Delete Forever
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Delete;
