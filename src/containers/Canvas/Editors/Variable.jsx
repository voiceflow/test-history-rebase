import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { selectStyles, variableComponent } from '@/components/VariableSelect/VariableSelect';
import { openTab } from '@/ducks/user';

import Expression from './components/Expression';
import Expressionfy from './components/Expressionfy';

class SetBlock extends Component {
  constructor(props) {
    super(props);
    const node = this.props.node;

    if (!node.extras.expression || !node.extras.expression.type) {
      node.extras.expression = {
        type: 'value',
        value: '',
        depth: 0,
      };
    }

    this.state = {
      node,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSelection(selected) {
    if (selected.value !== 'Create Variable') {
      const node = this.state.node;
      node.extras.variable = selected.value;

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    } else {
      localStorage.setItem('tab', 'variables');
      this.props.openVarTab('variables');
    }
  }

  onUpdate() {
    this.setState(
      {
        node: this.state.node,
      },
      this.props.onUpdate
    );
  }

  render() {
    const show = !(this.state.node.extras.expression.type === 'value' || this.state.node.extras.expression.type === 'variable');

    return (
      <div>
        <div className="variable-group">
          <span>Set </span>
          <Select
            classNamePrefix="variable-box"
            styles={selectStyles}
            components={{ Option: variableComponent }}
            placeholder={this.props.variables.length > 0 ? 'Variable Name' : 'No Variables Exist [!]'}
            className="variable-box"
            value={this.state.node.extras.variable ? { label: `{${this.state.node.extras.variable}}`, value: this.state.node.extras.variable } : null}
            onChange={this.handleSelection}
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
          <span> to:</span>
        </div>
        {show ? <Expressionfy expression={this.state.node.extras.expression} /> : null}
        <Expression expression={this.state.node.extras.expression} variables={this.props.variables} onUpdate={this.onUpdate} />
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
)(SetBlock);
