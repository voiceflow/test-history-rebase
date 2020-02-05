import cn from 'classnames';
import React from 'react';

import VariableSelect from '@/componentsV2/VariableSelect';
import { VariableTag } from '@/componentsV2/VariableTag';
import { ExpressionType } from '@/constants';

import ExpressionOperator from './ExpressionOperator';
import FlexFormContainer from './FlexFormContainer';
import OperatorDropdown from './OperatorDropdown';

function ExpressionVariable({ value, depth, onChange, isPreview, onUpdateType }) {
  if (isPreview) {
    return value ? <VariableTag>{`{${value}}`}</VariableTag> : <span className="math unknown">?</span>;
  }

  return (
    <FlexFormContainer className={cn('expression-block', ExpressionType.VARIABLE)}>
      <VariableSelect value={value} onChange={onChange} fullWidth />

      <OperatorDropdown update={onUpdateType} className="type-button" depth={depth}>
        <ExpressionOperator type="select" />
      </OperatorDropdown>
    </FlexFormContainer>
  );
}

export default React.memo(ExpressionVariable);
