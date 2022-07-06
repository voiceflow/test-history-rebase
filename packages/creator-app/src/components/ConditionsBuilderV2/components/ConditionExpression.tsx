import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useExpressionValidation } from '@/hooks';

import { EXPRESSION_PLACEHOLDER } from '../constants';
import ExpressionContainer from './ExpressionContainer';

export interface ConditionExpressionProps {
  expression: Realtime.ExpressionV2;
}

const ConditionExpression: React.FC<ConditionExpressionProps> = ({ expression }) => {
  const [error, resetError, isValidExpression, errorMessage] = useExpressionValidation();

  const onUpdate = React.useCallback(
    ({ text }: { text: string }) => {
      if (!text) return;

      if (isValidExpression(text)) {
        resetError();
        // onChange({ ...expression, value: text } as Realtime.ExpressionV2);
      }
    },
    [isValidExpression, expression.value /* onChange */]
  );

  return (
    <ExpressionContainer>
      <VariablesInput
        error={error}
        value={expression.value as string}
        onBlur={onUpdate}
        onFocus={resetError}
        multiline
        fullWidth
        placeholder={EXPRESSION_PLACEHOLDER}
        skipBlurOnUnmount
      />
      {error && (
        <Box fontSize={13} color="#e91e63" mt={16}>
          {errorMessage ? `Error: ${errorMessage}.` : 'Expression syntax is invalid.'}
        </Box>
      )}
    </ExpressionContainer>
  );
};

export default ConditionExpression;
