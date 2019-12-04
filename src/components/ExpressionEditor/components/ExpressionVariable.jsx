import cn from 'classnames';
import React from 'react';

import VariableTag from '@/components/VariableTag';
import VariableSelect from '@/componentsV2/VariableSelect';
import { ExpressionType } from '@/constants';

import ExpressionOperator from './ExpressionOperator';
import FormContainer from './FormContainer';
import OperatorDropdown from './OperatorDropdown';

function ExpressionVariable({ value, depth, onChange, isPreview, onUpdateType }) {
  if (isPreview) {
    return value ? <VariableTag>{`{${value}}`}</VariableTag> : <span className="math unknown">?</span>;
  }

  return (
    <FormContainer className={cn('expression-block', ExpressionType.VARIABLE)}>
      <VariableSelect value={value} onChange={onChange} fullWidth />

      <div className="type-button-container">
        <OperatorDropdown update={onUpdateType} className="type-button" depth={depth}>
          <ExpressionOperator type="select" />
        </OperatorDropdown>
      </div>
    </FormContainer>
  );
}

export default React.memo(ExpressionVariable);
