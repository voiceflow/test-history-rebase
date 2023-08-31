import { Box, Button, ButtonVariant, ErrorMessage, Input, Modal, Spinner } from '@voiceflow/ui';
import React from 'react';

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

  const deleteWorkspace = useDispatch(WorkspaceV2.deleteWorkspace);

  const [name, setName] = React.useState('');
  const [deleting, updateDeleting] = React.useState(false);
  const isValidConfirmationName = !name.trim() || name.trim().toLowerCase() === workspace?.name.trim().toLowerCase();

  const onDeleteWorkspace = async () => {
    try {
      updateDeleting(true);

      await deleteWorkspace(workspaceID);

      if (workspace) {
        trackEvents.trackWorkspaceDelete({ workspace });
      }
    } finally {
      api.close();
      updateDeleting(false);
    }
  };

  return (
    <Modal maxWidth={400} type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Delete Workspace</Modal.Header>
      <Modal.Body pt={0} paddingX={45}>
        {deleting ? (
          <Box mb={12}>
            <Spinner message="Deleting Workspace" />
          </Box>
        ) : (
          <>
            <Box.FlexCenter pb={16}>
              Warning, this is an undoable action. Deleting this workspace will permanently delete all assistants and content in this workspace.
            </Box.FlexCenter>

            <Input name="input" error={!isValidConfirmationName} onChangeText={setName} value={name} placeholder={workspace?.name} />
            {!isValidConfirmationName && <ErrorMessage mb={0}>Workspace name is incorrect</ErrorMessage>}
          </>
        )}
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={api.close} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button variant={ButtonVariant.PRIMARY} onClick={onDeleteWorkspace} disabled={!isValidConfirmationName}>
          Delete Forever
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Delete;
