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
  if (isPreview) {
    return (
      <span className="brackets">
        <span>( </span>
        <span className="not">NOT</span> {expressionify(value)}
        <span> )</span>
      </span>
    );
  }

  return (
    <FormContainer className={cn('expression-block composite', ExpressionType.NOT, { same: LEVELS[ExpressionType.NOT]?.has?.(parentType) })}>
      <OperatorDropdown update={onUpdateType} depth={depth} className="operator">
        <ExpressionOperator type={type} />

        <div role="button" tabIndex="0" className="type-button" onClick={onCollapse}>
          <SvgIcon icon="trash" size={12} />
        </div>
      </OperatorDropdown>

      <FormComponent value={value} onChange={onChange} variables={variables} />
    </FormContainer>
  );
}

export default React.memo(ExpressionNot);
