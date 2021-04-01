import { ExpressionType } from '@voiceflow/general-types';
import cn from 'classnames';
import React from 'react';

import VariableSelect from '@/components/VariableSelect';
import { OverflowVariableTag, VariableTag } from '@/components/VariableTag';

import FlexFormContainer from './FlexFormContainer';
import OperatorButton from './OperatorButton';

function ExpressionVariable({ value, depth, onChange, isPreview, onUpdateType, inEditor = false, maxLineLength = 48 }) {
  if (isPreview) {
    if (!value) {
      return <span className="math unknown">?</span>;
    }

    if (inEditor) {
      return <VariableTag>{`{${value.length <= maxLineLength ? value : `${value.substr(0, maxLineLength - 3)}...`}}`}</VariableTag>;
    }

    return <OverflowVariableTag variableName={value} maxLineLength={maxLineLength} />;
  }

  return (
    <FlexFormContainer className={cn('expression-block', ExpressionType.VARIABLE)}>
      <VariableSelect value={value} onChange={onChange} fullWidth rightAction={<OperatorButton depth={depth} onUpdateType={onUpdateType} />} />
    </FlexFormContainer>
  );
}

export default React.memo(ExpressionVariable);
