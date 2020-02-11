import cn from 'classnames';
import React from 'react';

import Input from '@/components/Input';
import { ExpressionType } from '@/constants';

import FormContainer from './FormContainer';
import OperatorButton from './OperatorButton';

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
      <Input placeholder="Value" value={value} onChange={onChangeInput} rightAction={<OperatorButton depth={depth} onUpdateType={onUpdateType} />} />
    </FormContainer>
  );
}

export default React.memo(ExpressionValue);
