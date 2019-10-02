import './ImportModal.css';

import jwt from 'jsonwebtoken';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import Button from '@/componentsV2/Button';
import Select from '@/componentsV2/Dropdown';

function ImportModal(props) {
  const { toggle, open, token, boards, importProject } = props;
  const [board, setBoard] = useState(boards[0]);
  const { projectName } = jwt.decode(token);

  const onChange = (value) => {
    boards.forEach((item) => {
      if (item.value === value) setBoard(item);
    });
  };

  return (
    <Modal isOpen={open} toggle={toggle} className="import-modal">
      <ModalHeader toggle={toggle}>Copy Project</ModalHeader>
      <ModalBody>
        <Label>
          Copy <strong>{projectName}</strong> to
        </Label>
        <Select options={boards} value={board.label} onSelect={onChange} disabled={boards.length === 1} />
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
  boards: state.team.allIds.map((id) => ({ value: id, label: state.team.byId[id].name })),
});

export default connect(mapStateToProps)(ImportModal);
