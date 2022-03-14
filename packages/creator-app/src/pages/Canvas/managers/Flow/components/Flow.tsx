import * as Realtime from '@voiceflow/realtime-sdk';
import { Alert, AlertVariant, Select } from '@voiceflow/ui';
import React from 'react';

import { DIAGRAM_ID_SEPARATOR, ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';

interface FlowOption {
  value: string;
  label: string;
}

const generateDiagramValue = (data: Pick<Realtime.Diagram, 'id' | 'name'>) => `${data.id}${DIAGRAM_ID_SEPARATOR}${data.name}`;

const buildOptions = (diagrams: Realtime.Diagram[]): FlowOption[] =>
  diagrams
    .filter((diagram) => diagram.name !== ROOT_DIAGRAM_NAME)
    .map((diagram) => ({
      value: generateDiagramValue(diagram),
      label: diagram.name,
    }));

interface FlowProps {
  diagram: Realtime.Diagram | null;
  diagramID: string | null;
  enterOnCreate?: boolean;
  onChange: (data: Partial<Realtime.NodeData<Realtime.NodeData.Flow>>) => void;
}

const Flow: React.FC<FlowProps> = ({ onChange, diagram, diagramID, enterOnCreate = true }) => {
  const diagrams = useSelector(DiagramV2.allDiagramsSelector);
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const createDiagram = useDispatch(Diagram.createComponentDiagram);
  const saveActiveDiagram = useDispatch(Diagram.saveActiveDiagram);

  const [value, setValue] = React.useState(diagram ? generateDiagramValue(diagram) : null);
  const options = React.useMemo(() => buildOptions(diagrams), [diagrams]);
  const optionsMap = React.useMemo(
    () => options.reduce<Record<string, FlowOption>>((obj, option) => Object.assign(obj, { [option.value]: option }), {}),
    [options]
  );

  const updateDiagram = React.useCallback((diagramID: string) => onChange({ diagramID, inputs: [], outputs: [] }), [onChange]);

  const flowDoesNotExist = diagramID && !diagram;

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
      updateDiagram(newDiagramID);
      if (enterOnCreate) {
        goToDiagram(newDiagramID);
      }
    },
    [options, updateDiagram, goToDiagram, createDiagram, saveActiveDiagram, enterOnCreate]
  );

  const validateCreate = (name: string) => {
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
        clearable={!!value}
        getOptionKey={(option) => option.value}
        getOptionValue={(option) => option?.value}
        getOptionLabel={(optionValue) => (optionValue ? optionsMap[optionValue]?.label : null)}
        placeholder="Name new flow or select existing"
        createInputPlaceholder="New Flow Name"
      />
      {flowDoesNotExist && (
        <Alert variant={AlertVariant.WARNING} mt={10}>
          Previously selected Flow is broken or has been deleted
        </Alert>
      )}
    </>
  );
};

export default Flow;
