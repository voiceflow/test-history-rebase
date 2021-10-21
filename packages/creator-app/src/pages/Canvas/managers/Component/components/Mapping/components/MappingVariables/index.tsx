import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { MapManaged, useDispatch, useSelector } from '@/hooks';
import { NodeData } from '@/models';

import { ButtonContainer, Container, DeleteButton, MappingContainer, RegularSelect, VariableDropdown, VariableMappingContainer } from './components';

interface MappingVariablesProps {
  items?: NodeData.VariableMapping[];
  reverse?: boolean;
  onChange: (items: NodeData.VariableMapping[]) => void;
  diagramID: string | null;
  mapManaged: MapManaged<NodeData.VariableMapping>;
}

const MappingVariables: React.FC<MappingVariablesProps> = ({ items, reverse, diagramID, mapManaged }) => {
  const activeVariables = useSelector(Diagram.activeDiagramAllVariablesSelector);
  const getComponentVariables = useSelector(Diagram.localVariablesByDiagramIDSelector);

  const addLocalVariable = useDispatch(Diagram.addActiveDiagramVariable);

  return (
    <Container>
      {mapManaged((mapping, { key, onUpdate, onRemove }) => {
        const updateFrom = (from?: string | null) => onUpdate({ from });
        const updateTo = (to?: string | null) => onUpdate({ to });

        const onCreateComponentVariable = (item: string) => {
          addLocalVariable(item);
          updateTo(item);
        };

        const disabledRemove = items?.length === 1;
        const GlobalVariableSelectComponent = !reverse ? RegularSelect : VariableDropdown;
        const ComponentVariableSelectComponent = !reverse ? VariableDropdown : RegularSelect;

        const globalVariableSelect = (
          <GlobalVariableSelectComponent
            value={mapping.from}
            options={activeVariables}
            onChange={updateFrom}
            fullWidth
            searchable
            placeholder={activeVariables.length > 0 ? 'Select Variable' : 'No Var..'}
          />
        );

        const componentVariableSelect = (
          <ComponentVariableSelectComponent
            value={mapping.to}
            onChange={updateTo}
            placeholder="Select Variable"
            options={getComponentVariables(diagramID!)}
            fullWidth
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onCreate={onCreateComponentVariable}
            creatable={false}
          />
        );

        return (
          <VariableMappingContainer key={key}>
            <MappingContainer>
              {reverse ? componentVariableSelect : globalVariableSelect}
              {reverse ? globalVariableSelect : componentVariableSelect}
            </MappingContainer>

            <ButtonContainer>
              <DeleteButton disabled={disabledRemove} onClick={() => !disabledRemove && onRemove()} />
            </ButtonContainer>
          </VariableMappingContainer>
        );
      })}
    </Container>
  );
};

export default MappingVariables;
