import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Select } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { NodeDataUpdater } from '@/pages/Canvas/types';

interface ComponentSelectProps {
  onChange: NodeDataUpdater<Realtime.NodeData.Component>;
  diagramID: Nullable<string>;
  enterOnCreate?: boolean;
}

const ComponentSelect: React.FC<ComponentSelectProps> = ({ onChange, diagramID, enterOnCreate = true }) => {
  const componentDiagrams = useSelector(DiagramV2.active.componentDiagramsSelector);

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const createEmptyComponent = useDispatch(Diagram.createEmptyComponent);

  const optionsMap = React.useMemo<Record<string, typeof componentDiagrams[number]>>(
    () => componentDiagrams.reduce((acc, diagram) => Object.assign(acc, { [diagram.id]: diagram }), {}),
    [componentDiagrams]
  );

  const setSelectedDiagram = React.useCallback((diagramID: Nullable<string>) => onChange({ diagramID, inputs: [], outputs: [] }), [onChange]);

  const setComponent = React.useCallback(
    (nextDiagramID: Nullable<string>) => {
      setSelectedDiagram(nextDiagramID);
    },
    [setSelectedDiagram]
  );

  const onCreate = React.useCallback(
    async (name: string) => {
      const newDiagramID = await createEmptyComponent(name);

      setSelectedDiagram(newDiagramID);

      if (enterOnCreate) {
        goToDiagram(newDiagramID);
      }
    },
    [setSelectedDiagram, goToDiagram, createEmptyComponent, enterOnCreate]
  );

  const validateCreate = React.useCallback(
    (name: string) => {
      const lowerCasedName = name.trim().toLowerCase();

      componentDiagrams.forEach((component) => {
        if (component.name.toLowerCase() === lowerCasedName) {
          throw new Error('Component name already in use, choose a different name.');
        }
      });

      return true;
    },
    [componentDiagrams]
  );

  return (
    <Select
      value={diagramID}
      options={componentDiagrams}
      onSelect={setComponent}
      onCreate={onCreate}
      clearable={!!diagramID}
      creatable
      searchable
      renderEmpty={componentDiagrams.length ? null : ({ search }) => (!search ? <Box flex={1}>Create a new Component</Box> : null)}
      placeholder="Name new component or select existing"
      validateCreate={validateCreate}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(optionValue) => optionValue && optionsMap[optionValue]?.name}
      createInputPlaceholder="New Component Name"
    />
  );
};

export default ComponentSelect;
