import cn from 'classnames';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { ExpressionType } from '@/constants';

import { LEVELS } from '../constants';
import ExpressionOperator from './ExpressionOperator';
import FormContainer from './FormContainer';
import OperatorDropdown from './OperatorDropdown';

function ExpressionNot({
  type,
  value,
  depth,
  onChange,
  variables,
  isPreview,
  parentType,
  onCollapse,
  onUpdateType,
  expressionify,
  formComponent: FormComponent,
}) {
  const sameLevel = LEVELS[type]?.has?.(parentType);

  if (isPreview) {
    return (
      <span className="brackets">
        {!sameLevel && <span className="parenthesis">( </span>}
        <span className="not">NOT</span> {expressionify(value, { parentType: type, depth: depth + 1 })}
        {!sameLevel && <span className="parenthesis"> )</span>}
      </span>
    );
  }

  return (
    <FormContainer className={cn('expression-block composite', ExpressionType.NOT, { same: sameLevel })}>
      <OperatorDropdown update={onUpdateType} depth={depth} className="operator">
        <ExpressionOperator type={type} />

        <div role="button" tabIndex="0" className="type-button" onClick={onCollapse}>
          <SvgIcon icon="trash" size={16} />
        </div>
      </OperatorDropdown>

      <FormComponent value={value} onChange={onChange} variables={variables} />
    </FormContainer>
  );
}

export default React.memo(ExpressionNot);
