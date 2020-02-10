import _lowerCase from 'lodash/lowerCase';
import _trim from 'lodash/trim';
import React from 'react';
import { Input } from 'reactstrap';

import Button from '@/components/LegacyButton';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { Spinner } from '@/components/Spinner';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { deleteWorkspace } from '@/ducks/workspace';
import { connect } from '@/hocs';

export function BoardDeleteModal({ workspace, deleteWorkspace }) {
  const [name, updateName] = React.useState('');
  const [deleting, updateDeleting] = React.useState(false);

  const { close, isOpened } = useModals(MODALS.BOARD_DELETE);
  const { close: closeSettingsModal } = useModals(MODALS.BOARD_SETTINGS);

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
    } finally {
      closeSettingsModal();
      close();
      updateDeleting(false);
    }
  }, [deleteWorkspace, workspace.id, closeSettingsModal, close]);

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
              <Button isBtn isPrimary disabled={_lowerCase(_trim(name)) !== _lowerCase(_trim(workspace.name))} onClick={onDeleteWorkspace}>
                Delete forever
              </Button>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

const mapStateToProps = {};

const mapDispatchToProps = {
  deleteWorkspace,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardDeleteModal);
