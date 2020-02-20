import cn from 'classnames';
import _isObject from 'lodash/isObject';
import React from 'react';

import { matchVariables } from '@/components/TextEditor/plugins/variables/utils/fromTextConvertor';
import { VariableTag } from '@/components/VariableTag';
import VariablesInput from '@/components/VariablesInput';
import { ExpressionType } from '@/constants';

import FormContainer from './FormContainer';
import OperatorButton from './OperatorButton';

const BLANK_SPACE_PATTERN = /^\s+$/;

function ExpressionAdvance({ value, depth, onChange, isPreview, onUpdateType }) {
  if (isPreview) {
    const matched = _isObject(value) ? value : matchVariables(value);

    return !matched.length ? (
      <span className="math unknown">?</span>
    ) : (
      <span className="math brackets">
        {matched.map((valuePart, index) =>
          _isObject(valuePart) ? (
            <VariableTag key={{ index }}>{`{${valuePart.name}}`}</VariableTag>
          ) : (
            valuePart
              ?.split('\n')
              .filter((line) => line && !BLANK_SPACE_PATTERN.test(line))
              .join(', ')
          )
        )}
      </span>
    );
  }

  return (
    <FormContainer className={cn('expression-block', ExpressionType.ADVANCE)}>
      <VariablesInput
        value={value}
        onBlur={({ text }) => onChange(text)}
        placeholder="Enter your expression here"
        multiline
        rightAction={<OperatorButton depth={depth} onUpdateType={onUpdateType} />}
      />
    </FormContainer>
  );
}

export default React.memo(ExpressionAdvance);
