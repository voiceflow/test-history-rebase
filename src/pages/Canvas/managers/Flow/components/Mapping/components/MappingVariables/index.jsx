import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';

import { ButtonContainer, Container, DeleteButton, MappingContainer, RegularSelect, VariableDropdown, VariableMappingContainer } from './components';

const MappingVariables = ({ mapManaged, reverse, items, activeVariables, flowVariables, addVariableToFlow }) => (
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

      const onCreateFlowVariable = async (item) => {
        await addVariableToFlow(item);
        updateTo(item);
      };

      const flowVariableSelect = (
        <FlowVariableSelectComponent
          value={mapping.to}
          onChange={updateTo}
          placeholder="Select Variable"
          options={flowVariables}
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
  flowVariables: Diagram.diagramVariablesSelector,
  activeVariables: allVariablesSelector,
};

const mapDispatchToProps = {
  addVariableToDiagram: Diagram.addDiagramVariable,
};

const mergeProps = ({ flowVariables: getVariables }, { addVariableToDiagram }, { diagramID }) => ({
  flowVariables: getVariables(diagramID),
  addVariableToFlow: (name) => addVariableToDiagram(diagramID, name),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MappingVariables);
