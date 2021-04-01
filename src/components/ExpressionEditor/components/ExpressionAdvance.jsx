import { ExpressionType } from '@voiceflow/general-types';
import cn from 'classnames';
import _isObject from 'lodash/isObject';
import React from 'react';

import { matchVariables } from '@/components/TextEditor/plugins/variables/utils/fromTextConvertor';
import VariablesInput from '@/components/VariablesInput';
import { OverflowVariableTag } from '@/components/VariableTag';

import FormContainer from './FormContainer';
import OperatorButton from './OperatorButton';

const BLANK_SPACE_PATTERN = /^\s+$/;

function ExpressionAdvance({ value, depth, onChange, isPreview, onUpdateType, maxLineLength }) {
  if (isPreview) {
    const matched = _isObject(value) ? value : matchVariables(value);

    return !matched.length ? (
      <span className="math unknown">?</span>
    ) : (
      <span className="math brackets">
        {matched.map((valuePart, index) =>
          _isObject(valuePart) ? (
            <OverflowVariableTag key={{ index }} variableName={valuePart.name} maxLineLength={maxLineLength} />
          ) : (
            valuePart
              ?.split('\n')
              .filter((line) => line && !line.match(BLANK_SPACE_PATTERN))
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
