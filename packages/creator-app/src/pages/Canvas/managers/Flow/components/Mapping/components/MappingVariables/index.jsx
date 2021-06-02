import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect } from '@/hocs';

import { ButtonContainer, Container, DeleteButton, MappingContainer, RegularSelect, VariableDropdown, VariableMappingContainer } from './components';

const MappingVariables = ({ mapManaged, diagramID, reverse, items, activeVariables, getFlowVariables, addLocalVariable }) => (
  <Container>
    {mapManaged((mapping, { key, onUpdate, onRemove }) => {
      const updateFrom = (from) => onUpdate({ from });
      const updateTo = (to) => onUpdate({ to });
      const GlobalVariableSelectComponent = !reverse ? RegularSelect : VariableDropdown;
      const FlowVariableSelectComponent = !reverse ? VariableDropdown : RegularSelect;
      const disabledRemove = items.length === 1;

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

      const onCreateFlowVariable = (item) => {
        addLocalVariable(item);
        updateTo(item);
      };

      const flowVariableSelect = (
        <FlowVariableSelectComponent
          value={mapping.to}
          onChange={updateTo}
          placeholder="Select Variable"
          options={getFlowVariables(diagramID)}
          fullWidth
          onCreate={onCreateFlowVariable}
          creatable={false}
        />
      );

      return (
        <VariableMappingContainer key={key}>
          <MappingContainer>
            {reverse ? flowVariableSelect : globalVariableSelect}
            {reverse ? globalVariableSelect : flowVariableSelect}
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
  getFlowVariables: Diagram.localVariablesByDiagramIDSelector,
};

const mapDispatchToProps = {
  addLocalVariable: Diagram.addActiveDiagramVariable,
};

export default connect(mapStateToProps, mapDispatchToProps)(MappingVariables);
