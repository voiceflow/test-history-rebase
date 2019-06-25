import './Expression.css';

import { selectStyles, variableComponent } from 'components/VariableSelect/VariableSelect';
import { openTab } from 'ducks/user';
import { parse } from 'mathjs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from 'reactstrap';

import { groups, symbols } from './Expression.config';
import VariableText from './VariableText';

import cn from 'classnames';
import { useToggle } from 'hooks/toggle';

// logic type that allows for arithmatic
// const arithmatic = groups[1]

const OperatorSelect = <i class="fas fa-code" />;

function OperatorDropdown(props) {
  const { depth, children, update, className } = props;

  const [open, toggleOpen] = useToggle(false);

  return (
    <Dropdown isOpen={open} toggle={toggleOpen}>
      <DropdownToggle tag="div" className={className}>
        {children}
      </DropdownToggle>
      <DropdownMenu className="expression-menu">
        {groups.map((group, i) => (
          <>
            <div key={i} className={`expression-group group-${group.length}`}>
              {group.map((type) => (
                <div key={type} onClick={() => (update(type), toggleOpen())}>
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
      this.setState(
        {
          expression,
        },
        this.props.onUpdate
      );
    }
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
    if (!this.state.expression || !this.state.expression.type) return null;

    let render = null;

    const type = this.state.expression.type;

    switch (type) {
      case 'variable':
        render = (
          <div className={`expression-block ${type}`}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button">
                {OperatorSelect}
              </OperatorDropdown>
            </div>
            <Select
              classNamePrefix="variable-box"
              styles={selectStyles}
              placeholder={this.props.variables.length > 0 ? 'Variable Name' : 'No Variables Exist [!]'}
              className="variable-box"
              components={{ Option: variableComponent }}
              value={this.state.expression.value ? { label: `{${this.state.expression.value}}`, value: this.state.expression.value } : null}
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
          </div>
        );
        break;

      case 'value':
        render = (
          <div className={`expression-block ${type}`}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button">
                {OperatorSelect}
              </OperatorDropdown>
            </div>
            <Input placeholder="value" value={this.state.expression.value} onChange={this.handleValue} />
          </div>
        );
        break;
      case 'advance':
        // const error = this.state.expression.value.error;
        render = (
          <div className={`expression-block ${type}`}>
            <div className="type-button-container">
              <OperatorDropdown update={this.handleType} className="type-button">
                {OperatorSelect}
              </OperatorDropdown>
            </div>
            <VariableText
              className={`editor form-control auto-height oneline ${this.state.expression.value.error ? 'is-invalid' : ''}`}
              raw={this.state.expression.value}
              placeholder={<React.Fragment>Enter your expression here</React.Fragment>}
              variables={this.props.variables}
              updateRaw={this.handleAdvance}
            />
          </div>
        );
        break;
      case 'not':
        render = (
          <div
            className={cn('expression-block', type, {
              same: type == this.props.parentType,
            })}
          >
            <div className="operator">
              <OperatorDropdown update={this.handleType}>{symbols[type]}</OperatorDropdown>
            </div>
            <Expression expression={this.state.expression.value} variables={this.props.variables} onUpdate={this.props.onUpdate} />
          </div>
        );
        break;
      default:
        render = (
          <div
            className={cn('expression-block', type, {
              same: type == this.props.parentType,
            })}
          >
            <Expression
              expression={this.state.expression.value[0]}
              openVarTab={this.props.openVarTab}
              variables={this.props.variables}
              onUpdate={this.props.onUpdate}
              parentType={type}
            />
            <OperatorDropdown update={this.handleType} className="operator">
              {symbols[type]}
              <div className="type-button" onClick={this.defaultTop}>
                <i className="fas fa-trash" />
              </div>
            </OperatorDropdown>
            <Expression
              expression={this.state.expression.value[1]}
              openVarTab={this.props.openVarTab}
              variables={this.props.variables}
              onUpdate={this.props.onUpdate}
              parentType={type}
            />
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
