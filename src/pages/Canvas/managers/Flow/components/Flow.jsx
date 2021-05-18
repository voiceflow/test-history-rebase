import React from 'react';

import Select from '@/components/Select';
import { DIAGRAM_ID_SEPARATOR, ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';

import MissingFlowMessage from './MissingFlowMessage';

const generateDiagramValue = (data) => `${data.id}${DIAGRAM_ID_SEPARATOR}${data.name}`;

const buildOptions = (diagrams) =>
  diagrams
    .filter((diagram) => diagram.name !== ROOT_DIAGRAM_NAME)
    .map((diagram) => ({
      value: generateDiagramValue(diagram),
      label: diagram.name,
    }));

function Flow({ onChange, diagrams, diagram, diagramID, goToDiagram, enterOnCreate = true, createDiagram, saveActiveDiagram }) {
  const [value, setValue] = React.useState(diagram ? generateDiagramValue(diagram) : null);
  const options = React.useMemo(() => buildOptions(diagrams), [diagrams]);
  const optionsMap = React.useMemo(() => options.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [options]);
  const setSelectedDiagram = React.useCallback((diagramID) => onChange({ diagramID, inputs: [], outputs: [] }), [onChange]);

  const flowDoesNotExist = diagramID && !diagram;

  const updateDiagram = React.useCallback(
    (diagramID) => {
      setSelectedDiagram(diagramID);
    },
    [setSelectedDiagram]
  );

  const setFlow = React.useCallback(
    (selected) => {
      const diagramID = selected?.substring(0, selected.indexOf(DIAGRAM_ID_SEPARATOR));
      updateDiagram(diagramID);
      setValue(selected);
    },
    [updateDiagram]
  );

  const onCreate = React.useCallback(
    async (name) => {
      await saveActiveDiagram();
      const newDiagramID = await createDiagram(name);

      setValue(generateDiagramValue({ id: newDiagramID, name }));
      setSelectedDiagram(newDiagramID);
      if (enterOnCreate) {
        goToDiagram(newDiagramID);
      }
    },
    [options, setSelectedDiagram, goToDiagram, createDiagram, saveActiveDiagram, enterOnCreate]
  );

  const validateCreate = (name) => {
    options.forEach((flow) => {
      if (flow.label.toLowerCase() === name.toLowerCase()) throw new Error('Flow name already in use, choose a different name.');
    });
  };

  return (
    <>
      <Select
        value={value}
        options={options}
        onSelect={setFlow}
        onCreate={onCreate}
        creatable
        searchable
        validateCreate={validateCreate}
        clearable={value}
        getOptionValue={(option) => option?.value}
        getOptionLabel={(optionValue) => optionsMap[optionValue]?.label}
        placeholder="Create new flow or select existing"
        createInputPlaceholder="New Flow Name"
      />
      {flowDoesNotExist && <MissingFlowMessage variant="warning" message="Previously selected Flow is broken or has been deleted." />}
    </>
  );
}

const mapStateToProps = {
  diagrams: Diagram.allDiagramsSelector,
};

const mapDispatchToProps = {
  createDiagram: Diagram.createDiagram,
  saveActiveDiagram: Diagram.saveActiveDiagram,
  goToDiagram: Router.goToDiagram,
};

export default connect(mapStateToProps, mapDispatchToProps)(Flow);
