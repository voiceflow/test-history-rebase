import cn from 'classnames';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { ARITHMETIC, LEVELS } from '../constants';
import ExpressionOperator from './ExpressionOperator';
import FormContainer from './FormContainer';
import OperatorDropdown from './OperatorDropdown';

function ExpressionDefault({
  type,
  value,
  depth,
  onChange,
  variables,
  isPreview,
  onCollapse,
  parentType,
  onUpdateType,
  expressionify,
  formComponent: FormComponent,
}) {
  const sameLevel = LEVELS[type]?.has?.(parentType);
  const withParenthesis = !!depth && !sameLevel;

  if (isPreview) {
    if (ARITHMETIC.includes(type)) {
      let first = expressionify(value[0], { parentType: type, depth: depth + 1 });

      if (first.props.className && !first.props.className.startsWith('math')) {
        first = <span className="NaN" />;
      }

      let second = expressionify(value[1], { parentType: type, depth: depth + 1 });
      if (second.props.className && !second.props.className.startsWith('math')) {
        second = <span className="NaN" />;
      }

      return (
        <span className="math brackets">
          {withParenthesis && <span className="parenthesis">( </span>}
          {first} {<ExpressionOperator type={type} />} {second}
          {withParenthesis && <span className="parenthesis"> )</span>}
        </span>
      );
    }

    if (type) {
      return (
        <span className="brackets">
          {withParenthesis && <span className="parenthesis">( </span>}
          {expressionify(value[0], { parentType: type, depth: depth + 1 })}
          <span> </span>
          <span className={type}>
            <ExpressionOperator type={type} />
          </span>
          <span> </span>
          {expressionify(value[1], { parentType: type, depth: depth + 1 })}
          {withParenthesis && <span className="parenthesis"> )</span>}
        </span>
      );
    }
  }

  return (
    <FormContainer className={cn('expression-block composite', type, { same: sameLevel })}>
      <FormComponent value={value[0]} onChange={(v) => onChange([v, value[1]])} parentType={type} variables={variables} />

      <OperatorDropdown update={onUpdateType} className="operator">
        <ExpressionOperator type={type} />

        <div role="button" tabIndex="0" className="type-button" onClick={onCollapse}>
          <SvgIcon icon="trash" size={16} />
        </div>
      </OperatorDropdown>

      <FormComponent value={value[1]} onChange={(v) => onChange([value[0], v])} parentType={type} variables={variables} />
    </FormContainer>
  );
}

export default React.memo(ExpressionDefault);
