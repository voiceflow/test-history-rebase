import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, Input, Modal, Spinner } from '@voiceflow/ui';
import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { useDispatch, useTrackingEvents } from '@/hooks';

import manager from '../../manager';

export interface Props {
  workspace: Realtime.Workspace;
}

const Delete = manager.create<Props>('BoardDelete', () => ({ api, type, opened, hidden, animated, workspace }) => {
  const [trackEvents] = useTrackingEvents();

  const deleteWorkspace = useDispatch(Workspace.deleteWorkspace);

  const [name, setName] = React.useState('');
  const [deleting, updateDeleting] = React.useState(false);

  const onDeleteWorkspace = async () => {
    try {
      updateDeleting(true);

      await deleteWorkspace(workspace.id);

      trackEvents.trackWorkspaceDelete(workspace.id);
    } finally {
      api.close();
      updateDeleting(false);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Delete Workspace</Modal.Header>
      <Modal.Body pt={0} paddingX={45}>
        {deleting ? (
          <Box mb={12}>
            <Spinner message="Deleting Workspace" />
          </Box>
        ) : (
          <div>
            <b>Warning</b>, deleting a workspace will permanently delete all of its projects and live voice applications.
            <br /> <br />
            <label>Workspace name</label>
            <Input name="input" onChangeText={setName} value={name} placeholder="Workspace Name" />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer width="100%">
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={onDeleteWorkspace}
          disabled={name.trim().toLowerCase() !== workspace.name.trim().toLowerCase()}
        >
          Delete forever
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Delete;
