import React from 'react';

import LegacyButton from '@/components/Button';
import Button from '@/componentsV2/Button';
import VariableSelect from '@/componentsV2/VariableSelect';
import { openTab } from '@/ducks/user';
import { variablesByDiagramIDSelector } from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';
import { allVariablesSelector } from '@/store/selectors';

import VariableMappingContainer from './VariableMappingContainer';

const variableMappingFactory = () => ({ from: null, to: null });

const FlowVariables = ({ reverse, items, activeVariables, flowVariables, onChange, openVarTab }) => {
  const { mapManaged, onAdd } = useManager(items, onChange, { factory: variableMappingFactory });

  return (
    <>
      {mapManaged((mapping, { key, onUpdate, onRemove }) => {
        const updateFrom = (from) => onUpdate({ from });
        const updateTo = (to) => onUpdate({ to });

        const globalVariableSelect = (
          <VariableSelect
            className="map-box"
            value={mapping.from}
            onChange={updateFrom}
            placeholder={activeVariables.length > 0 ? 'Variable' : 'No Var..'}
            options={activeVariables.map((variable, variableIndex) => {
              if (variableIndex === activeVariables.length - 1) {
                return { label: variable, value: variable, openVar: openVarTab };
              }
              return { label: `{${variable}}`, value: variable };
            })}
            fullWidth
          />
        );

        const flowVariableSelect = (
          <VariableSelect
            className="map-box"
            value={mapping.to}
            onChange={updateTo}
            placeholder="Flow Var.."
            options={flowVariables.map((variable) => ({ label: `{${variable}}`, value: variable }))}
            fullWidth
          />
        );

        return (
          <VariableMappingContainer className="variable_map" key={key}>
            {reverse ? flowVariableSelect : globalVariableSelect}
            <img src="/arrow-right.svg" className="mr-2 ml-2" width="7px" alt="map to" />
            {reverse ? globalVariableSelect : flowVariableSelect}
            <LegacyButton isCloseSmall onClick={onRemove} />
          </VariableMappingContainer>
        );
      })}
      <Button variant="secondary" icon="plus" onClick={onAdd}>
        Add Variable Map
      </Button>
    </>
  );
};

const mapStateToProps = {
  activeVariables: allVariablesSelector,
  flowVariables: variablesByDiagramIDSelector,
};

const mapDispatchToProps = {
  openVarTab: openTab,
};

const mergeProps = ({ flowVariables: getVariables }, _, { diagramID }) => ({
  flowVariables: getVariables(diagramID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FlowVariables);
