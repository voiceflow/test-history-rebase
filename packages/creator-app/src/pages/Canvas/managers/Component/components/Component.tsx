import { Nullable } from '@voiceflow/common';
import { Select } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { NodeData } from '@/models';
import { NodeDataUpdater } from '@/pages/Canvas/types';

interface ComponentProps {
  onChange: NodeDataUpdater<NodeData.Component>;
  diagramID: Nullable<string>;
}

const Component: React.FC<ComponentProps> = ({ onChange, diagramID }) => {
  const componentsDiagrams = useSelector(Diagram.activeComponentsDiagramsSelector);

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const createEmptyComponent = useDispatch(Diagram.createEmptyComponent);
  const saveActiveDiagram = useDispatch(Diagram.saveActiveDiagram);

  const optionsMap = React.useMemo<Record<string, typeof componentsDiagrams[number]>>(
    () => componentsDiagrams.reduce((acc, diagram) => Object.assign(acc, { [diagram.id]: diagram }), {}),
    [componentsDiagrams]
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
      await saveActiveDiagram();

      const newDiagramID = await createEmptyComponent(name);

      setSelectedDiagram(newDiagramID);
      goToDiagram(newDiagramID);
    },
    [setSelectedDiagram, goToDiagram, createEmptyComponent, saveActiveDiagram]
  );

  const validateCreate = React.useCallback(
    (name: string) => {
      const lowerCasedName = name.trim().toLowerCase();

      componentsDiagrams.forEach((component) => {
        if (component.name.toLowerCase() === lowerCasedName) {
          throw new Error('Component name already in use, choose a different name.');
        }
      });

      return true;
    },
    [componentsDiagrams]
  );

  return (
    <Select
      value={diagramID}
      options={componentsDiagrams}
      onSelect={setComponent}
      onCreate={onCreate}
      clearable={!!diagramID}
      creatable
      searchable
      placeholder="Name new component or select existing"
      validateCreate={validateCreate}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(optionValue) => optionValue && optionsMap[optionValue]?.name}
      createInputPlaceholder="New Component Name"
    />
  );
};

export default Component;
