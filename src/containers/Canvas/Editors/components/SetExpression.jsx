import { selectStyles, variableComponent } from 'components/VariableSelect/VariableSelect';
import { openTab } from 'ducks/user';
import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import Expression from './Expression';
import Expressionfy from './Expressionfy';

const SetExpression = ({ block, variables, onSelection, onRemove, onUpdate, openVarTab }) => {
  const show = !(block.expression.type === 'value' || block.expression.type === 'variable' || block.expression.type === 'advance');

  return (
    <div className="conditional-wrapper">
      <div className="close" onClick={onRemove} />
      <div className="variable-group">
        <span>Set</span>
        <Select
          classNamePrefix="variable-box"
          placeholder="Variable Name"
          className="variable-box"
          styles={selectStyles}
          components={{ Option: variableComponent }}
          value={block.variable ? { label: `{${block.variable}}`, value: block.variable } : null}
          onChange={onSelection}
          options={
            Array.isArray(variables)
              ? variables.map((variable, index) => {
                  if (index === variables.length - 1) {
                    return { label: variable, value: variable, openVar: openVarTab };
                  }

                  return { label: `{${variable}}`, value: variable };
                })
              : null
          }
        />
        <span>to:</span>
      </div>

      {show && <Expressionfy expression={block.expression} />}

      <Expression expression={block.expression} variables={variables} onUpdate={onUpdate} />
    </div>
  );
};

const mapDispatchToProps = {
  openVarTab: openTab,
};

export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(SetExpression);
