import { Box, Button, ButtonVariant, Input, Modal, Spinner } from '@voiceflow/ui';
import React from 'react';

import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';

import manager from '../../manager';

export interface Props {
  workspaceID: string;
}

const Delete = manager.create<Props>('BoardDelete', () => ({ api, type, opened, hidden, animated, workspaceID }) => {
  const [trackEvents] = useTrackingEvents();

  const workspace = useSelector(WorkspaceV2.workspaceByIDSelector, { id: workspaceID });

  const deleteWorkspace = useDispatch(Workspace.deleteWorkspace);

  const [name, setName] = React.useState('');
  const [deleting, updateDeleting] = React.useState(false);

  const onDeleteWorkspace = async () => {
    try {
      updateDeleting(true);

      await deleteWorkspace(workspaceID);

      trackEvents.trackWorkspaceDelete(workspaceID);
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
            <b>Warning</b>, deleting a workspace will permanently delete all of its assistants and live voice applications.
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
          disabled={name.trim().toLowerCase() !== workspace?.name.trim().toLowerCase()}
        >
          Delete forever
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Delete;
