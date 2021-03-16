import React from 'react';
import { Input } from 'reactstrap';

import Button from '@/components/LegacyButton';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { Spinner } from '@/components/Spinner';
import { ModalType } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals, useTrackingEvents } from '@/hooks';
import * as Models from '@/models';
import { ConnectedProps } from '@/types';

export type BoardDeleteModalProps = {
  workspace: Models.Workspace;
};

export const BoardDeleteModal: React.FC<BoardDeleteModalProps & ConnectedBoardDeleteModalProps> = ({ workspace, deleteWorkspace }) => {
  const [trackEvents] = useTrackingEvents();
  const [name, updateName] = React.useState('');
  const [deleting, updateDeleting] = React.useState(false);

  const { close, isOpened } = useModals(ModalType.BOARD_DELETE);

  const onNameChange = React.useCallback(({ target }) => updateName(target.value), [updateName]);

  const onClose = React.useCallback(() => {
    updateName('');
    updateDeleting(false);
    close();
  }, [updateName, updateDeleting, close]);

  const onDeleteWorkspace = React.useCallback(async () => {
    try {
      updateDeleting(true);
      await deleteWorkspace(workspace.id);
      trackEvents.trackWorkspaceDelete(workspace.id);
    } finally {
      close();
      updateDeleting(false);
    }
  }, [deleteWorkspace, workspace.id, close]);

  return (
    <Modal isOpen={isOpened} toggle={onClose} className="upgrade-modal">
      <ModalHeader toggle={onClose} header="Delete Workspace" />

      <ModalBody className="px-45 pt-0 overflow-hidden">
        {deleting ? (
          <div className="mb-3">
            <Spinner message="Deleting Workspace" />
          </div>
        ) : (
          <div>
            <b>Warning</b>, deleting a workspace will permanently delete all of its projects and live voice applications.
            <br /> <br />
            <label>Workspace name</label>
            <Input name="input" onChange={onNameChange} value={name} placeholder="Workspace Name" />
            <div className="mt-3 mb-2 text-center">
              <Button isBtn isPrimary disabled={name.trim().toLowerCase() !== workspace.name.trim().toLowerCase()} onClick={onDeleteWorkspace}>
                Delete forever
              </Button>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

const mapDispatchToProps = {
  deleteWorkspace: Workspace.deleteWorkspace,
};

type ConnectedBoardDeleteModalProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(BoardDeleteModal) as React.FC<BoardDeleteModalProps>;
