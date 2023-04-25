import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useExpressionValidator } from '@/hooks';

import { EXPRESSION_PLACEHOLDER } from '../constants';
import ExpressionContainer from './ExpressionContainer';

export interface ConditionExpressionProps {
  expression?: Realtime.ExpressionData;
}

const ConditionExpression: React.FC<ConditionExpressionProps> = ({ expression }) => {
  const expressionValidator = useExpressionValidator();

  const onUpdate = React.useCallback(
    ({ text }: { text: string }) => {
      if (!text) return;

      if (expressionValidator.validate(text)) {
        // onChange({ ...expression, value: text } as Realtime.ExpressionV2);
      }
    },
    [expressionValidator.validate, expression?.value /* onChange */]
  );

  return (
    <ExpressionContainer>
      <VariablesInput
        error={!!expressionValidator.error}
        onBlur={onUpdate}
        onFocus={expressionValidator.resetError}
        multiline
        fullWidth
        placeholder={EXPRESSION_PLACEHOLDER}
        skipBlurOnUnmount
      />

      {expressionValidator.error && (
        <Box fontSize={13} color="#BD425F" mt={16}>
          {expressionValidator.error}
        </Box>
      )}
    </ExpressionContainer>
  );
};

export default ConditionExpression;
