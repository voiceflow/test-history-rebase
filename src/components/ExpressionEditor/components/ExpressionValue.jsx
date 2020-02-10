import cn from 'classnames';
import React from 'react';

import Input from '@/components/Input';
import { ExpressionType } from '@/constants';

import ExpressionOperator from './ExpressionOperator';
import FormContainer from './FormContainer';
import OperatorDropdown from './OperatorDropdown';

const DOUBLE_QUOTE_PATTERN = /"/g;

function ExpressionValue({ value, depth, onChange, isPreview, onUpdateType }) {
  const onChangeInput = React.useCallback(({ target }) => onChange(target.value), [onChange]);

  if (isPreview) {
    if (!value) {
      return <span className="math unknown">?</span>;
    }

    const strValue = value.toString();

    return Number.isNaN(strValue) ? (
      <span className="value">{strValue.replace(DOUBLE_QUOTE_PATTERN, "'")}</span>
    ) : (
      <span className="math value">{parseInt(strValue, 10)}</span>
    );
  }

  return (
    <FormContainer className={cn('expression-block', ExpressionType.VALUE)}>
      <div className="type-button-container">
        <OperatorDropdown update={onUpdateType} className="type-button" depth={depth}>
          <ExpressionOperator type="select" />
        </OperatorDropdown>
      </div>

      <Input placeholder="Value" value={value} onChange={onChangeInput} />
    </FormContainer>
  );
}

export default React.memo(ExpressionValue);
