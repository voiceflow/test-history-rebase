/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { Tooltip } from 'react-tippy';
import { FormGroup, Input, Label } from 'reactstrap';

import * as Panel from '@/components/Panel';
import VariableBox from '@/components/VariableBox';
import { KeyCodes } from '@/constants';
import { setConfirm } from '@/ducks/modal';
import { activeDiagramIDSelector, addGlobalVariable } from '@/ducks/skill';
import { addVariableToDiagram } from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks/toggle';

const PROJECT_VARIABLE_DESCRIPTION = 'Project Variables can be used anywhere in the project and save across sessions';
const FLOW_VARIABLE_DESCRIPTION = 'Flow Variables exist only in this flow and are reset after you leave the flow';

const VariableForm = ({ lockOwner, prevOwner, addFlowVariable, addVariable, setConfirm }) => {
  const [formValue, setFormValue] = React.useState('');
  const updateFormValue = ({ target }) => setFormValue(target.value);
  const [editingDiagramVariables, toggleEditTarget] = useToggle();

  const handleKeyPress = (target) => {
    if (target.charCode !== KeyCodes.ENTER) return;

    if (editingDiagramVariables) {
      addFlowVariable(formValue);
      setFormValue('');
    } else {
      try {
        addVariable(formValue);
        setFormValue('');
      } catch (err) {
        setConfirm({
          warning: true,
          text: err.message,
        });
      }
    }
  };

  return (
    <Panel.Section>
      <FormGroup className="mb-0 text-center">
        <Label className="text-left">
          Create Variable{' '}
          <Tooltip
            position="bottom"
            html={<div style={{ width: 180 }}>{editingDiagramVariables ? FLOW_VARIABLE_DESCRIPTION : PROJECT_VARIABLE_DESCRIPTION}</div>}
          >
            <span onClick={toggleEditTarget} className="pointer">
              {editingDiagramVariables ? '(Flow)' : '(Project)'}
            </span>
          </Tooltip>
        </Label>
        <VariableBox>
          <Input
            onKeyPress={handleKeyPress}
            name={editingDiagramVariables ? 'new_var' : 'new_global'}
            value={formValue}
            onChange={updateFormValue}
            maxLength="16"
            placeholder={editingDiagramVariables ? 'Flow Variable Name' : 'Variable Name'}
            disabled={!!lockOwner}
            autoFocus={!lockOwner && !prevOwner}
          />
        </VariableBox>
      </FormGroup>
      <small className="text-muted pt-2 d-block">{editingDiagramVariables ? "Press 'Enter' to add flow variable" : "Press 'Enter' to add"}</small>
    </Panel.Section>
  );
};

const mapStateToProps = {
  diagramID: activeDiagramIDSelector,
};

const mapDispatchToProps = {
  addVariable: addGlobalVariable,
  addFlowVariable: addVariableToDiagram,
  setConfirm,
};

const mergeProps = ({ diagramID }, { addFlowVariable }) => ({
  addFlowVariable: (variable) => addFlowVariable(diagramID, variable),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(VariableForm);
