import './Expression.css';

import cn from 'classnames';
import { selectStyles, variableComponent } from 'components/VariableSelect/VariableSelect';
import { openTab } from 'ducks/user';
import { useToggle } from 'hooks/toggle';
import { parse } from 'mathjs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Dropdown, DropdownMenu, DropdownToggle, Input } from 'reactstrap';

import { groups, levels, symbols } from './Expression.config';
import VariableText from './VariableText';

// logic type that allows for arithmatic
// const arithmatic = groups[1]

const OPERATOR_SELECT = <i className="fas fa-code" />;

function OperatorDropdown(props) {
  const { depth, children, update, className } = props;

  const [open, toggleOpen] = useToggle(false);

  let menuGroups = groups;
  if (depth === 8) menuGroups = [['value', 'variable'], ['advance']];

  return (
    <Dropdown isOpen={open} toggle={toggleOpen}>
      <DropdownToggle tag="div" className={className}>
        {children}
      </DropdownToggle>
      <DropdownMenu className="expression-menu">
        {menuGroups.map((group, index) => (
          <div key={index} className={`expression-group group-${group.length}`}>
            {group.map((type) => (
              <div
                key={type}
                onClick={() => {
                  update(type);
                  toggleOpen();
                }}
              >
                {symbols[type]}
              </div>
            ))}
          </div>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export class Expression extends Component {
  state = {
    expression: this.props.expression,
    dropdownOpen: false,
  };

  inputRef = React.createRef();

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    this.setState({
      expression: nextProps.expression,
    });
  }

  focus() {
    setTimeout(() => this.inputRef.current && this.inputRef.current.focus(), 200);
  }

  handleValue = (event) => {
    const { expression } = this.state;

    expression.value = event.target.value;

    this.setState({ expression }, this.props.onUpdate);
  };

  handleType = (type) => {
    const { expression } = this.state;
    const depth = expression.depth + 1;

    if (type === expression.type) return;

    const originalType = expression.type;
    expression.type = type;

    switch (expression.type) {
      case 'advance':
      case 'value':
        expression.value = '';
        break;
      case 'variable':
        expression.value = null;
        break;
      case 'not':
        switch (originalType) {
          case 'advance':
          case 'value':
          case 'variable':
            expression.value = {
              type: originalType,
              value: expression.value,
              depth,
            };
            break;
          default:
            expression.value = {
              type: expression.value[0].type,
              value: expression.value[0].value,
              depth,
            };
            break;
        }
        break;
      default:
        if (Array.isArray(expression.value)) {
          // do nothing since its already 2 type value
        } else if (originalType === 'advance' || originalType === 'value' || originalType === 'variable') {
          expression.value = [
            {
              type: originalType,
              value: expression.value,
              depth,
            },
            {
              type: 'value',
              value: '',
              depth,
            },
          ];
        } else {
          expression.value = [
            {
              type: 'value',
              value: '',
              depth,
            },
            {
              type: 'value',
              value: '',
              depth,
            },
          ];
        }
    }

    this.setState({ expression }, this.props.onUpdate);
  };

  defaultTop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { expression } = this.state;

    if (Array.isArray(expression.value)) {
      expression.type = expression.value[0].type;
      expression.value = expression.value[0].value;
    } else if (expression.value && expression.value.type) {
      expression.type = expression.value.type;
      expression.value = expression.value.value;
    }

    this.setState({ expression }, this.props.onUpdate);
  };

  handleAdvance = (raw) => {
    if (this.state.expression.type !== 'advance') {
      return;
    }

    raw.error = false;
    if (raw.text !== '') {
      try {
        parse(raw.text.replace(/{(\w*)}/g, "v['$1']").split('\n'));
      } catch (e) {
        raw.error = e.message;
      }
    }

    const { expression } = this.state;
    expression.value = raw;

    this.setState({ expression }, this.props.onUpdate);
  };

  handleSelection = (selected) => {
    if (selected.value !== 'Create Variable') {
      const expression = this.state.expression;
      expression.value = selected.value;

      this.setState({ expression }, this.props.onUpdate);
    } else {
      localStorage.setItem('tab', 'variables');
      this.props.openVarTab('variables');
    }
  };

  render() {
    const { expression } = this.state;
    if (!expression || !expression.type) {
      return null;
    }

    const { onUpdate, openVarTab, variables, parentType } = this.props;

    const type = expression.type;

    switch (type) {
      case 'variable':
        return (
          // eslint-disable-next-line sonarjs/no-duplicate-string
          <div className={cn('expression-block', `${type}`)}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button" depth={expression.depth}>
                {OPERATOR_SELECT}
              </OperatorDropdown>
            </div>
            <Select
              classNamePrefix="variable-box"
              styles={selectStyles}
              placeholder={variables.length > 0 ? 'Variable Name' : 'No Variables Exist [!]'}
              className="variable-box"
              components={{ Option: variableComponent }}
              value={expression.value ? { label: `{${expression.value}}`, value: expression.value } : null}
              onChange={this.handleSelection}
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
              ref={this.inputRef}
            />
          </div>
        );

      case 'value':
        return (
          <div className={cn('expression-block', `${type}`)}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button" depth={expression.depth}>
                {OPERATOR_SELECT}
              </OperatorDropdown>
            </div>
            <Input placeholder="value" value={expression.value} onChange={this.handleValue} innerRef={this.inputRef} />
          </div>
        );

      case 'advance':
        return (
          <div className={cn('expression-block', `${type}`)}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button" depth={expression.depth}>
                {OPERATOR_SELECT}
              </OperatorDropdown>
            </div>
            <VariableText
              className={`editor form-control auto-height oneline ${expression.value.error ? 'is-invalid' : ''}`}
              raw={expression.value}
              placeholder={<React.Fragment>Enter your expression here</React.Fragment>}
              variables={variables}
              updateRaw={this.handleAdvance}
              ref={this.inputRef}
            />
          </div>
        );

      case 'not':
        return (
          <div
            className={cn('expression-block', type, {
              same: levels[type] && levels[type].has(parentType),
            })}
          >
            <OperatorDropdown update={this.handleType} depth={expression.depth} className="operator">
              {symbols[type]}
              <div className="type-button" onClick={this.defaultTop}>
                <i className="fas fa-trash" />
              </div>
            </OperatorDropdown>
            <Expression expression={expression.value} variables={variables} onUpdate={onUpdate} ref={this.inputRef} />
          </div>
        );

      default:
        return (
          <div
            className={cn('expression-block', type, {
              same: levels[type] && levels[type].has(parentType),
            })}
          >
            <Expression
              expression={expression.value[0]}
              openVarTab={openVarTab}
              variables={variables}
              onUpdate={onUpdate}
              parentType={type}
              ref={this.inputRef}
            />
            <OperatorDropdown update={this.handleType} className="operator">
              {symbols[type]}
              <div className="type-button" onClick={this.defaultTop}>
                <i className="fas fa-trash" />
              </div>
            </OperatorDropdown>
            <Expression expression={expression.value[1]} openVarTab={openVarTab} variables={variables} onUpdate={onUpdate} parentType={type} />
          </div>
        );
    }
  }
}

const mapDispatchToProps = {
  openVarTab: openTab,
};

export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(Expression);
