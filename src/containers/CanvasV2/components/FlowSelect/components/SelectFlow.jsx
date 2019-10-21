import React from 'react';

import Select from '@/components/Select';
import { DIAGRAM_ID_SEPARATOR, ROOT_DIAGRAM_NAME } from '@/constants';
import { allDiagramsSelector, updateSubDiagrams } from '@/ducks/diagram';
import { connect } from '@/hocs';

import CreateNewFlow from './CreateNewFlow';

const buildOptions = (diagrams, diagramID) =>
  diagrams
    .filter((diagram) => diagram.name !== ROOT_DIAGRAM_NAME && diagram.id !== diagramID)
    .map((diagram) => ({
      value: `${diagram.id}${DIAGRAM_ID_SEPARATOR}${diagram.name}`,
      label: (
        <>
          <img src="/flows.svg" alt="flows" width="15" />
          &nbsp;&nbsp; {diagram.name}
        </>
      ),
    }));

const SelectFlow = ({ diagrams, data, onChange, updateSubDiagrams }) => {
  const options = buildOptions(diagrams, data.diagramID);
  const updateSelectedDiagram = (diagramID) => onChange({ diagramID, inputs: [], outputs: [] });
  const updateDiagram = (diagramID) => {
    updateSelectedDiagram(diagramID);

    updateSubDiagrams();
  };

  return (
    <>
      <CreateNewFlow onChange={updateSelectedDiagram} />

      <div className="break">
        <span className="break-text">OR</span>
      </div>

      {diagrams.length && (
        <>
          <label>Select Existing Flow</label>
          <Select
            placeholder={
              <>
                <img src="/flows.svg" alt="flows" width="15" />
                &nbsp;&nbsp; Select Flow
              </>
            }
            classNamePrefix="select-box"
            onChange={(selected) => updateDiagram(selected.value.substring(0, selected.value.indexOf(DIAGRAM_ID_SEPARATOR)))}
            options={options}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = {
  diagrams: allDiagramsSelector,
};

const mapDispatchToProps = {
  updateSubDiagrams,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFlow);
