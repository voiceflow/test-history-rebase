import cn from 'classnames';
import _isObject from 'lodash/isObject';
import React from 'react';

import { VariableTag } from '@/components/VariableTag';
import VariableText from '@/components/VariableText';
import { ExpressionType } from '@/constants';

import ExpressionOperator from './ExpressionOperator';
import FormContainer from './FormContainer';
import OperatorDropdown from './OperatorDropdown';

const BLANK_SPACE_PATTERN = /^\s+$/;

function ExpressionAdvance({ value, depth, onChange, isPreview, variables, onUpdateType }) {
  if (isPreview) {
    return !_isObject(value) || value[0] === '' ? (
      <span className="math unknown">?</span>
    ) : (
      <span className="math brackets">
        {value.map((valuePart, index) =>
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
      <VariableText
        value={value}
        onChange={onChange}
        variables={variables}
        className={cn('editor', 'form-control', 'auto-height', 'oneline', { 'is-invalid': value.error })}
        placeholder="Enter your expression here"
      />

      <div className="type-button-container">
        <OperatorDropdown update={onUpdateType} className="type-button" depth={depth}>
          <ExpressionOperator type="select" />
        </OperatorDropdown>
      </div>
    </FormContainer>
  );
}

export default React.memo(ExpressionAdvance);
