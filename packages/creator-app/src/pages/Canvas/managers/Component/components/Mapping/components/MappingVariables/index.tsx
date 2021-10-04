import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect } from '@/hocs';
import { MapManaged } from '@/hooks/manager';
import { ConnectedProps } from '@/types';

import { ButtonContainer, Container, DeleteButton, MappingContainer, RegularSelect, VariableDropdown, VariableMappingContainer } from './components';

interface MappingVariablesProps {
  reverse?: boolean;
  mapManaged: MapManaged<{ from: string | null; to: string | null }>;
  diagramID: string | null;
  items?: { from: string | null; to: string | null }[];
  onChange: (items: { from: string | null; to: string | null }[]) => void;
}

const MappingVariables: React.FC<MappingVariablesProps & ConnectedMappingVariablesProps> = ({
  mapManaged,
  diagramID,
  reverse,
  items,
  activeVariables,
  getComponentVariables,
  addLocalVariable,
}) => (
  <Container>
    {mapManaged((mapping, { key, onUpdate, onRemove }) => {
      const updateFrom = (from?: string | null) => onUpdate({ from });
      const updateTo = (to?: string | null) => onUpdate({ to });
      const GlobalVariableSelectComponent = !reverse ? RegularSelect : VariableDropdown;
      const ComponentVariableSelectComponent = !reverse ? VariableDropdown : RegularSelect;
      const disabledRemove = items?.length === 1;

      const globalVariableSelect = (
        <GlobalVariableSelectComponent
          value={mapping.from}
          onChange={updateFrom}
          fullWidth
          searchable
          placeholder={activeVariables.length > 0 ? 'Select Variable' : 'No Var..'}
          options={activeVariables}
        />
      );

      const onCreateComponentVariable = (item: string) => {
        addLocalVariable(item);
        updateTo(item);
      };

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

const mapStateToProps = {
  activeVariables: Diagram.activeDiagramAllVariablesSelector,
  getComponentVariables: Diagram.localVariablesByDiagramIDSelector,
};

const mapDispatchToProps = {
  addLocalVariable: Diagram.addActiveDiagramVariable,
};

type ConnectedMappingVariablesProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(MappingVariables) as React.FC<MappingVariablesProps>;
