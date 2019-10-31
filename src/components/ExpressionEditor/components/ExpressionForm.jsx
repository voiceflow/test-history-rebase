import cn from 'classnames';
import * as MathJS from 'mathjs';
import React, { Component } from 'react';
import { Input } from 'reactstrap';

import VariableText from '@/components/VariableText';
import VariableSelect from '@/componentsV2/VariableSelect';
import { ExpressionType } from '@/constants';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';
import { swallowEvent } from '@/utils/dom';

import { LEVELS, SYMBOLS } from '../constants';
import { evolveExpression } from '../utils';
import Container from './ExpressionFormContainer';
import OperatorDropdown from './OperatorDropdown';

const BRACKET_PATTERN = /{(\w*)}/g;
const OPERATOR_SELECT = <i className="fas fa-code" />;

const mapStateToProps = {
  variables: allVariablesSelector,
};

@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)
class ExpressionForm extends Component {
  state = {
    dropdownOpen: false,
    error: false,
  };

  updateType = (type) => {
    const { expression, onChange } = this.props;

    if (type === expression.type) return;

    onChange(evolveExpression(expression, type));
  };

  collapseExpression = swallowEvent(() => {
    const { expression, onChange } = this.props;

    if (Array.isArray(expression.value)) {
      const firstValue = expression.value[0];

      onChange({ ...expression, type: firstValue.type, value: firstValue.value });
    } else if (expression.value && expression.value.type) {
      onChange({ ...expression, type: expression.value.type, value: expression.value.value });
    }
  });

  updateAdvanced = (value) => {
    const { expression, onChange } = this.props;

    if (expression.type !== ExpressionType.ADVANCE) {
      return;
    }

    if (value.text) {
      try {
        MathJS.parse(value.text.replace(BRACKET_PATTERN, "v['$1']").split('\n'));
      } catch (err) {
        this.setState({ error: err.message });
      }
    }

    onChange({ ...expression, value });
  };

  render() {
    const { expression, variables, parentType, onChange } = this.props;

    if (!expression || !expression.type) {
      return null;
    }

    const updateValue = (value) => onChange({ ...expression, value });
    const { type } = expression;

    switch (type) {
      case ExpressionType.VARIABLE:
        return (
          // eslint-disable-next-line sonarjs/no-duplicate-string
          <Container className={cn('expression-block', type)}>
            <VariableSelect value={expression.value} onChange={updateValue} fullWidth />
            <div className="type-button-container">
              <OperatorDropdown update={this.updateType} className="type-button" depth={expression.depth}>
                {OPERATOR_SELECT}
              </OperatorDropdown>
            </div>
          </Container>
        );

      case ExpressionType.VALUE:
        return (
          <Container className={cn('expression-block', type)}>
            <div className="type-button-container">
              <OperatorDropdown update={this.updateType} className="type-button" depth={expression.depth}>
                {OPERATOR_SELECT}
              </OperatorDropdown>
            </div>
            <Input placeholder="value" value={expression.value} onChange={({ target }) => updateValue(target.value)} />
          </Container>
        );

      case ExpressionType.ADVANCE:
        return (
          <Container className={cn('expression-block', type)}>
            <VariableText
              className={cn('editor', 'form-control', 'auto-height', 'oneline', { 'is-invalid': expression.value.error })}
              value={expression.value}
              placeholder="Enter your expression here"
              variables={variables}
              onChange={this.updateAdvanced}
            />
            <div className="type-button-container">
              <OperatorDropdown update={this.updateType} className="type-button" depth={expression.depth}>
                {OPERATOR_SELECT}
              </OperatorDropdown>
            </div>
          </Container>
        );

      case 'not':
        return (
          <Container
            className={cn('expression-block', type, {
              same: LEVELS[type] && LEVELS[type].has(parentType),
            })}
          >
            <OperatorDropdown update={this.updateType} depth={expression.depth} className="operator">
              {SYMBOLS[type]}
              <div className="type-button" onClick={this.collapseExpression}>
                <i className="fas fa-trash" />
              </div>
            </OperatorDropdown>
            <ExpressionForm expression={expression.value} onChange={updateValue} />
          </Container>
        );

      default:
        return (
          <Container
            className={cn('expression-block', type, {
              same: LEVELS[type] && LEVELS[type].has(parentType),
            })}
          >
            <ExpressionForm expression={expression.value[0]} onChange={(value) => updateValue([value, expression.value[1]])} parentType={type} />
            <OperatorDropdown update={this.updateType} className="operator">
              {SYMBOLS[type]}
              <div className="type-button" onClick={this.collapseExpression}>
                <i className="fas fa-trash" />
              </div>
            </OperatorDropdown>
            <ExpressionForm expression={expression.value[1]} onChange={(value) => updateValue([expression.value[0], value])} parentType={type} />
          </Container>
        );
    }
  }
}

export default ExpressionForm;
