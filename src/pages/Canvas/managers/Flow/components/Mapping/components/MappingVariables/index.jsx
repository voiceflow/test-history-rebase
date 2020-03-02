import React from 'react';

import * as VariableSet from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';

import { ButtonContainer, Container, DeleteButton, MappingContainer, RegularSelect, VariableDropdown, VariableMappingContainer } from './components';

const MappingVariables = ({ mapManaged, reverse, items, activeVariables, flowVariables, addVariableToFlow }) => {
  return (
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
          addVariableToFlow(item);
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
              <DeleteButton disabled={disabledRemove} type="minus" onClick={() => !disabledRemove && onRemove()} />
            </ButtonContainer>
          </VariableMappingContainer>
        );
      })}
    </Container>
  );
};

const mapStateToProps = {
  flowVariables: VariableSet.variablesByDiagramIDSelector,
  activeVariables: allVariablesSelector,
};

const mapDispatchToProps = {
  addVariableToDiagramAndSave: VariableSet.addVariableToDiagramAndSave,
};

const mergeProps = ({ flowVariables: getVariables }, { addVariableToDiagramAndSave }, { diagramID }) => ({
  flowVariables: getVariables(diagramID),
  addVariableToFlow: (name) => addVariableToDiagramAndSave(diagramID, name),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MappingVariables);
