import cuid from 'cuid';
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

function Flow({ onChange, diagrams, diagram, updateSubDiagrams, createDiagram, diagramID, goToDiagram, saveActiveDiagram }) {
  const [value, setValue] = React.useState(diagram ? generateDiagramValue(diagram) : null);
  const [options, setOptions] = React.useState(() => buildOptions(diagrams));
  const optionsMap = React.useMemo(() => options.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [options]);

  const setSelectedDiagram = React.useCallback((diagramID) => onChange({ diagramID, inputs: [], outputs: [] }), [onChange]);

  const flowDoesNotExist = diagramID && !diagram;

  const updateDiagram = React.useCallback(
    (diagramID) => {
      setSelectedDiagram(diagramID);
      updateSubDiagrams();
    },
    [setSelectedDiagram, updateSubDiagrams]
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
    async (label) => {
      const diagramID = cuid();
      await createDiagram(diagramID, label);
      await updateSubDiagrams();
      await saveActiveDiagram();

      const newValue = { value: diagramID, label };
      const optionValue = generateDiagramValue(newValue);
      setOptions([...options, { value: optionValue, label }]);
      setValue(optionValue);
      setSelectedDiagram(diagramID);
      goToDiagram(diagramID);
    },
    [createDiagram, updateSubDiagrams, saveActiveDiagram, options, setSelectedDiagram, goToDiagram]
  );

  return (
    <>
      <Select
        value={value}
        options={options}
        onSelect={setFlow}
        onCreate={onCreate}
        creatable
        searchable
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
  updateSubDiagrams: Diagram.updateSubDiagrams,
  goToDiagram: Router.goToDiagram,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Flow);
