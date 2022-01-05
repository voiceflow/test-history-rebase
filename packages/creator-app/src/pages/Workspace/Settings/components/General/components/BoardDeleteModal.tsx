import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, Input, Spinner } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { useDidUpdateEffect, useDispatch, useModals, useTrackingEvents } from '@/hooks';

export interface BoardDeleteModalProps {
  workspace: Realtime.Workspace;
}

export const BoardDeleteModal: React.FC<BoardDeleteModalProps> = ({ workspace }) => {
  const [trackEvents] = useTrackingEvents();

  const deleteWorkspace = useDispatch(Workspace.deleteWorkspace);

  const [name, setName] = React.useState('');
  const [deleting, updateDeleting] = React.useState(false);

  const { close, isOpened } = useModals(ModalType.BOARD_DELETE);

  const onDeleteWorkspace = async () => {
    try {
      updateDeleting(true);

      await deleteWorkspace(workspace.id);

      trackEvents.trackWorkspaceDelete(workspace.id);
    } finally {
      close();
      updateDeleting(false);
    }
  };

  useDidUpdateEffect(() => {
    if (!isOpened) {
      setName('');
      updateDeleting(false);
    }
  }, [isOpened]);

  return (
    <Modal id={ModalType.BOARD_DELETE} title="Delete Workspace">
      <ModalBody pt={0} paddingX={45}>
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
      </ModalBody>

      <ModalFooter width="100%">
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={onDeleteWorkspace}
          disabled={name.trim().toLowerCase() !== workspace.name.trim().toLowerCase()}
        >
          Delete forever
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BoardDeleteModal;
