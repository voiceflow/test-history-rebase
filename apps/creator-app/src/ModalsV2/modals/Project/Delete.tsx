import { datadogRum } from '@datadog/browser-rum';
import { Box, Button, Input, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as ProjectList from '@/ducks/projectListV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { getErrorMessage } from '@/utils/error';

import manager from '../../manager';

interface Props {
  projectID: string;
  boardID?: string;
}

const Delete = manager.create<Props>(
  'ProjectDelete',
  () =>
    ({ api, type, opened, hidden, animated, projectID, boardID, closePrevented }) => {
      const [confirmName, setConfirmName] = React.useState('');

      const project = useSelector(ProjectV2.projectByIDSelector, { id: projectID });

      const onDeleteProject = useDispatch(ProjectV2.deleteProject);
      const onGoToDashboard = useDispatch(Router.goToDashboard);
      const onDeleteProjectFromList = useDispatch(ProjectList.deleteProjectFromList);

      const [trackingEvents] = useTrackingEvents();

      const onDelete = async () => {
        if (!project) {
          datadogRum.addError('Project not found', { source: 'DeleteProjectModal' });
          toast.genericError();
          return;
        }

        try {
          api.preventClose();
          trackingEvents.trackProjectDelete({ projectID });

          if (boardID) {
            await onDeleteProjectFromList(boardID, projectID);
          } else {
            await onDeleteProject(projectID);
            onGoToDashboard();
          }

          api.enableClose();
          api.close();

          toast.success(`Successfully deleted ${project?.name}`);
        } catch (e) {
          toast.error(getErrorMessage(e));
          api.enableClose();
        }
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>
            Delete Assistant
          </Modal.Header>

          <Modal.Body centered>
            <Box pb={16}>
              Your assistant will be permanently deleted with no chance of recovery. Type{' '}
              <strong>{project?.name}</strong> in the input below to confirm.
            </Box>

            <Input
              placeholder={project?.name || ''}
              value={confirmName}
              onChangeText={(value) => setConfirmName(value)}
            />
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius>
              Cancel
            </Button>

            <Button squareRadius onClick={onDelete} disabled={closePrevented || confirmName !== project?.name}>
              Delete Forever
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Delete;
