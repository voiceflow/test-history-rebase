import cn from 'classnames';
import React from 'react';

import VariableSelect from '@/components/VariableSelect';
import { VariableTag } from '@/components/VariableTag';
import { ExpressionType } from '@/constants';

import FlexFormContainer from './FlexFormContainer';
import OperatorButton from './OperatorButton';

function ExpressionVariable({ value, depth, onChange, isPreview, onUpdateType }) {
  if (isPreview) {
    return value ? <VariableTag>{`{${value}}`}</VariableTag> : <span className="math unknown">?</span>;
  }

  return (
    <FlexFormContainer className={cn('expression-block', ExpressionType.VARIABLE)}>
      <VariableSelect value={value} onChange={onChange} fullWidth rightAction={<OperatorButton depth={depth} onUpdateType={onUpdateType} />} />
    </FlexFormContainer>
  );
}

export default React.memo(ExpressionVariable);
