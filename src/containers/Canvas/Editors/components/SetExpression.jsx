import { selectStyles, variableComponent } from 'components/VariableSelect/VariableSelect';
import { openTab } from 'ducks/user';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import Expression from './Expression';
import Expressionfy from './Expressionfy';

class SetExpression extends Component {
  render() {
    const block = this.props.block;
    const show = !(block.expression.type === 'value' || block.expression.type === 'variable' || block.expression.type === 'advance');

    return (
      <div className="conditional-wrapper">
        <div className="close" onClick={this.props.onRemove} />
        <div className="variable-group">
          <span>Set</span>
          <Select
            classNamePrefix="variable-box"
            placeholder="Variable Name"
            className="variable-box"
            styles={selectStyles}
            components={{ Option: variableComponent }}
            value={block.variable ? { label: `{${block.variable}}`, value: block.variable } : null}
            onChange={this.props.onSelection}
            options={
              Array.isArray(this.props.variables)
                ? this.props.variables.map((variable, idx) => {
                    if (idx === this.props.variables.length - 1) {
                      return { label: variable, value: variable, openVar: this.props.openVarTab };
                    }
                    return { label: `{${variable}}`, value: variable };
                  })
                : null
            }
          />
          <span>to:</span>
        </div>
        {show ? <Expressionfy expression={block.expression} /> : null}
        <Expression expression={block.expression} variables={this.props.variables} onUpdate={this.props.onUpdate} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openVarTab: (tab) => dispatch(openTab(tab)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SetExpression);
