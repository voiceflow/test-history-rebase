import cuid from 'cuid';
import React from 'react';
import { Input } from 'reactstrap';

import SvgIcon from '@/components/SvgIcon';
import { createDiagram, saveActiveDiagram, updateSubDiagrams } from '@/ducks/diagram';
import { setConfirm } from '@/ducks/modal';
import { goToDiagram } from '@/ducks/router';
import { connect } from '@/hocs';
import { stopPropagation } from '@/utils/dom';

import NewFlowButton from './NewFlowButton';

const CreateNewFlow = ({ createDiagram, onChange, goToDiagram, saveActiveDiagram, setConfirm, updateSubDiagrams }) => {
  const name = React.useRef('');

  const onConfirm = async () => {
    const diagramID = cuid();

    await createDiagram(diagramID, name.current);
    onChange(diagramID);
    await updateSubDiagrams();
    await saveActiveDiagram();
    goToDiagram(diagramID);
  };

  return (
    <>
      <label>Create a New Flow</label>
      <NewFlowButton
        onClick={() =>
          setConfirm({
            confirm: onConfirm,
            text: (
              <>
                <label>Name New Flow</label>
                <Input
                  onChange={stopPropagation((e) => {
                    name.current = e.target.value;
                  })}
                />
              </>
            ),
          })
        }
      >
        <SvgIcon icon="flows" size={15} color="currentColor"></SvgIcon>
        Create New Flow
      </NewFlowButton>
    </>
  );
};

const mapDispatchToProps = {
  createDiagram,
  goToDiagram,
  saveActiveDiagram,
  setConfirm,
  updateSubDiagrams,
};

export default connect(
  null,
  mapDispatchToProps
)(CreateNewFlow);
