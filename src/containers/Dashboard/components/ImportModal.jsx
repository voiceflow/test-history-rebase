import './ImportModal.css';

import jwt from 'jsonwebtoken';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Label } from 'reactstrap';

import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/Modal';
import Button from '@/componentsV2/Button';
import Select from '@/componentsV2/Select';

function ImportModal(props) {
  const { toggle, open, token, boards, importProject } = props;
  const [board, setBoard] = useState(boards[0]);
  const { projectName } = jwt.decode(token);

  const updateBoard = React.useCallback((boardID) => setBoard(boards.find(({ value }) => value === boardID)), [boards, setBoard]);

  return (
    <Modal isOpen={open} toggle={toggle} className="import-modal">
      <ModalHeader toggle={toggle}>Copy Project</ModalHeader>
      <ModalBody>
        <Label>
          Copy <strong>{projectName}</strong> to
        </Label>
        <Select
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
        <Button onClick={() => importProject(board.value)}>Copy Project</Button>
      </ModalFooter>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  boards: state.workspace.allIds.map((id) => ({ value: id, label: state.workspace.byId[id].name })),
});

export default connect(mapStateToProps)(ImportModal);
