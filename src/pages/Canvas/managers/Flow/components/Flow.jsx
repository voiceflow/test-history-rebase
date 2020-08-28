import cuid from 'cuid';
import React from 'react';

import Select from '@/components/Select';
import { FeatureFlag } from '@/config/features';
import { DIAGRAM_ID_SEPARATOR, ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';

import MissingFlowMessage from './MissingFlowMessage';

const generateDiagramValue = (data) => `${data.id}${DIAGRAM_ID_SEPARATOR}${data.name}`;

const buildOptions = (diagrams) =>
  diagrams
    .filter((diagram) => diagram.name !== ROOT_DIAGRAM_NAME)
    .map((diagram) => ({
      value: generateDiagramValue(diagram),
      label: diagram.name,
    }));

function Flow({
  onChange,
  diagrams,
  diagram,
  updateSubDiagrams,
  createDiagram,
  diagramID,
  goToDiagram,
  saveActiveDiagram,
  enterOnCreate = true,
  createDiagramV2,
  saveActiveDiagramV2,
}) {
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const [value, setValue] = React.useState(diagram ? generateDiagramValue(diagram) : null);
  const options = React.useMemo(() => buildOptions(diagrams), [diagrams]);
  const optionsMap = React.useMemo(() => options.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [options]);

  const setSelectedDiagram = React.useCallback((diagramID) => onChange({ diagramID, inputs: [], outputs: [] }), [onChange]);

  const flowDoesNotExist = diagramID && !diagram;

  const updateDiagram = React.useCallback(
    (diagramID) => {
      setSelectedDiagram(diagramID);
      if (!dataRefactor.isEnabled) {
        updateSubDiagrams();
      }
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
    async (name) => {
      if (dataRefactor.isEnabled) {
        await saveActiveDiagramV2();
        const newDiagramID = await createDiagramV2(name);

        setValue(generateDiagramValue({ id: newDiagramID, name }));
        setSelectedDiagram(newDiagramID);
        if (enterOnCreate) {
          goToDiagram(newDiagramID);
        }
        return;
      }

      const diagramID = cuid();
      await createDiagram(diagramID, name);
      await updateSubDiagrams();
      await saveActiveDiagram();

      setValue(generateDiagramValue({ id: diagramID, name }));
      setSelectedDiagram(diagramID);
      if (enterOnCreate) {
        goToDiagram(diagramID);
      }
    },
    [
      createDiagram,
      updateSubDiagrams,
      saveActiveDiagram,
      options,
      setSelectedDiagram,
      goToDiagram,
      createDiagramV2,
      saveActiveDiagramV2,
      enterOnCreate,
    ]
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
  createDiagramV2: DiagramV2.createNewDiagram,
  saveActiveDiagram: Diagram.saveActiveDiagram,
  saveActiveDiagramV2: DiagramV2.saveActiveDiagram,
  updateSubDiagrams: Diagram.updateSubDiagrams,
  goToDiagram: Router.goToDiagram,
};

export default connect(mapStateToProps, mapDispatchToProps)(Flow);
