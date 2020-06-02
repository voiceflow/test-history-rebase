import './ImportModal.css';

import React, { useState } from 'react';

import Button from '@/components/Button';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/LegacyModal';
import { toast } from '@/components/Toast';
import { UserRole } from '@/constants';
import { userIDSelector } from '@/ducks/account';
import { allWorkspacesSelector, workspaceByIDSelector } from '@/ducks/workspace';
import { extractMemberById } from '@/ducks/workspace/utils';
import { connect } from '@/hocs';

import { ImportSelect } from './ModalComponents';

const allowedToClone = (workspace, creatorId) => {
  const creatorRole = extractMemberById(creatorId, workspace.members)?.role;
  if ([UserRole.ADMIN, UserRole.EDITOR].includes(creatorRole)) {
    return true;
  }
  return false;
};
function ImportModal(props) {
  const { toggle, open, importProject, creatorId, workspaces, workspaceByIDSelector } = props;
  const [boards] = useState(() => workspaces.map((workspace) => ({ value: workspace.id, label: workspace.name })));
  const [board, setBoard] = useState(boards[0]);

  const updateBoard = React.useCallback((boardID) => setBoard(boards.find(({ value }) => value === boardID)), [boards, setBoard]);

  const cloneProject = (workspaceId) => {
    const workspace = workspaceByIDSelector(workspaceId);
    if (allowedToClone(workspace, creatorId)) {
      importProject(workspaceId);
    } else {
      toast.error(
        `You are a viewer on the workspace ${workspace.name}, and therefore don’t have the permissions to clone projects to this workspace`
      );
    }
  };
  return (
    <Modal isOpen={open} toggle={toggle} className="import-modal">
      <ModalHeader toggle={toggle} header="Copy Project"></ModalHeader>
      <ModalBody padding="0 32px 32px 32px">
        <ImportSelect
          prefix="CLONE TO"
          value={board?.label}
          onSelect={updateBoard}
          disabled={boards.length === 1}
          options={boards}
          getOptionValue={(option) => option.value}
          renderOptionLabel={(option) => option.label}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="tertiary" onClick={toggle}>
          Cancel
        </Button>
        <Button onClick={() => cloneProject(board.value)}>Copy Project</Button>
      </ModalFooter>
    </Modal>
  );
}

const mapStateToProps = {
  creatorId: userIDSelector,
  workspaces: allWorkspacesSelector,
  workspaceByIDSelector,
};

export default connect(mapStateToProps)(ImportModal);
