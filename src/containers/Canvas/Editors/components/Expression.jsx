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

const OperatorSelect = <i className="fas fa-code" />;

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
        {menuGroups.map((group, i) => (
          <>
            <div key={i} className={`expression-group group-${group.length}`}>
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
          </>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

class Expression extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expression: this.props.expression,
      dropdownOpen: false,
    };

    this.handleValue = this.handleValue.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleType = this.handleType.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleAdvance = this.handleAdvance.bind(this);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    this.setState({
      expression: nextProps.expression,
    });
  }

  handleValue(event) {
    const expression = this.state.expression;
    expression.value = event.target.value;

    this.setState(
      {
        expression,
      },
      this.props.onUpdate
    );
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  handleType(type) {
    const expression = this.state.expression;
    const depth = this.state.expression.depth + 1;

    if (type === expression.type) return;

    const og_type = expression.type;
    expression.type = type;

    switch (expression.type) {
      case 'advance':
        expression.value = '';
        break;
      case 'value':
        expression.value = '';
        break;
      case 'variable':
        expression.value = null;
        break;
      case 'not':
        if (og_type === 'advance') {
          expression.value = {
            type: 'advance',
            value: expression.value,
            depth,
          };
        } else if (og_type === 'value') {
          expression.value = {
            type: 'value',
            value: expression.value,
            depth,
          };
        } else if (og_type === 'variable') {
          expression.value = {
            type: 'variable',
            value: expression.value,
            depth,
          };
        } else {
          expression.value = {
            type: expression.value[0].type,
            value: expression.value[0].value,
            depth,
          };
        }
        break;
      default:
        if (Array.isArray(expression.value)) {
          // do nothing since its already 2 type value
        } else if (og_type === 'advance') {
          expression.value = [
            {
              type: 'advance',
              value: expression.value,
              depth,
            },
            {
              type: 'value',
              value: '',
              depth,
            },
          ];
        } else if (og_type === 'value') {
          expression.value = [
            {
              type: 'value',
              value: expression.value,
              depth,
            },
            {
              type: 'value',
              value: '',
              depth,
            },
          ];
        } else if (og_type === 'variable') {
          expression.value = [
            {
              type: 'variable',
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

    this.setState(
      {
        expression,
      },
      this.props.onUpdate
    );
  }

  defaultTop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const expression = this.state.expression;
    if (Array.isArray(expression.value)) {
      expression.type = expression.value[0].type;
      expression.value = expression.value[0].value;
    } else if (expression.value && expression.value.type) {
      expression.type = expression.value.type;
      expression.value = expression.value.value;
    }
    this.setState(
      {
        expression,
      },
      this.props.onUpdate
    );
  };

  handleAdvance(raw) {
    if (this.state.expression.type !== 'advance') return;
    raw.error = false;
    if (raw.text !== '') {
      try {
        parse(raw.text.replace(/{(\w*)}/g, "v['$1']").split('\n'));
      } catch (e) {
        raw.error = e.message;
      }
    }
    const expression = this.state.expression;
    expression.value = raw;
    this.setState(
      {
        expression,
      },
      this.props.onUpdate
    );
  }

  handleSelection(selected) {
    if (selected.value !== 'Create Variable') {
      const expression = this.state.expression;
      expression.value = selected.value;

      this.setState(
        {
          expression,
        },
        this.props.onUpdate
      );
    } else {
      localStorage.setItem('tab', 'variables');
      this.props.openVarTab('variables');
    }
  }

  render() {
    const { expression } = this.state;
    if (!expression || !expression.type) return null;

    const { onUpdate, openVarTab, variables, parentType } = this.props;

    let render = null;
    const type = expression.type;

    switch (type) {
      case 'variable':
        render = (
          <div className={`expression-block ${type}`}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button" depth={expression.depth}>
                {OperatorSelect}
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
                  ? variables.map((variable, idx) => {
                      if (idx === variables.length - 1) {
                        return { label: variable, value: variable, openVar: openVarTab };
                      }
                      return { label: `{${variable}}`, value: variable };
                    })
                  : null
              }
            />
          </div>
        );
        break;

      case 'value':
        render = (
          <div className={`expression-block ${type}`}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button" depth={expression.depth}>
                {OperatorSelect}
              </OperatorDropdown>
            </div>
            <Input placeholder="value" value={expression.value} onChange={this.handleValue} />
          </div>
        );
        break;
      case 'advance':
        // const error = expression.value.error;
        render = (
          <div className={`expression-block ${type}`}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button" depth={expression.depth}>
                {OperatorSelect}
              </OperatorDropdown>
            </div>
            <VariableText
              className={`editor form-control auto-height oneline ${expression.value.error ? 'is-invalid' : ''}`}
              raw={expression.value}
              placeholder={<React.Fragment>Enter your expression here</React.Fragment>}
              variables={variables}
              updateRaw={this.handleAdvance}
            />
          </div>
        );
        break;
      case 'not':
        render = (
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
            <Expression expression={expression.value} variables={variables} onUpdate={onUpdate} />
          </div>
        );
        break;
      default:
        render = (
          <div
            className={cn('expression-block', type, {
              same: levels[type] && levels[type].has(parentType),
            })}
          >
            <Expression expression={expression.value[0]} openVarTab={openVarTab} variables={variables} onUpdate={onUpdate} parentType={type} />
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

    return render;
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
)(Expression);
