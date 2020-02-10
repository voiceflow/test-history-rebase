/* eslint-disable no-shadow */
import React from 'react';
import { Tooltip } from 'react-tippy';
import { Label } from 'reactstrap';

import * as Panel from '@/components/Panel';
import SvgIcon from '@/components/SvgIcon';
import { VariableTag } from '@/components/VariableTag';
import { GLOBAL_VARIABLES, GlobalVariable } from '@/constants';
import { activeDiagramIDSelector, globalVariablesSelector, removeGlobalVariable } from '@/ducks/skill';
import { removeVariableFromDiagram } from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { activeDiagramVariablesSelector } from '@/store/selectors';

import VariableBox from './VariableBox';

const VARIABLE_DESCRIPTION = {
  [GlobalVariable.SESSIONS]: 'The Number of times a particular user has opened the app',
  [GlobalVariable.USER_ID]: "The user's Amazon/Google unique id",
  [GlobalVariable.TIMESTAMP]: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)',
  [GlobalVariable.PLATFORM]: 'The platform your skill is running on ("alexa" or "google")',
  [GlobalVariable.LOCALE]: 'The locale of the user (eg en-US, en-CA, it-IT, fr-FR ...)',
};

const VariableCloud = ({ diagramVariables, variables, removeFlowVariable, removeGlobalVariable }) => (
  <Panel.Section>
    {diagramVariables.length > 0 && (
      <div className="mb-4">
        <Label>Flow Variables</Label>
        <VariableBox>
          {diagramVariables.map((variable) => (
            <VariableTag key={variable} className="global">
              {`{${variable}}`} <SvgIcon variant="standard" icon="close" onClick={() => removeFlowVariable(variable)} size={9} />
            </VariableTag>
          ))}
        </VariableBox>
      </div>
    )}
    <Label>Variables</Label>
    <VariableBox>
      {GLOBAL_VARIABLES.map((variable) => (
        <Tooltip key={variable} position="bottom" html={<div style={{ width: 165 }}>{VARIABLE_DESCRIPTION[variable]}</div>}>
          <VariableTag className="global default">{`{${variable}}`}</VariableTag>
        </Tooltip>
      ))}
      {variables.map((variable) => (
        <VariableTag key={variable} className="global">
          {`{${variable}}`} <SvgIcon variant="standard" icon="close" onClick={() => removeGlobalVariable(variable)} size={9} />
        </VariableTag>
      ))}
    </VariableBox>
  </Panel.Section>
);

const mapStateToProps = {
  diagramID: activeDiagramIDSelector,
  variables: globalVariablesSelector,
  diagramVariables: activeDiagramVariablesSelector,
};

const mapDispatchToProps = {
  removeFlowVariable: removeVariableFromDiagram,
  removeGlobalVariable,
};

const mergeProps = ({ diagramID }, { removeFlowVariable }) => ({
  removeFlowVariable: (variable) => removeFlowVariable(diagramID, variable),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(VariableCloud);
