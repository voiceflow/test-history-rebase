import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Label from '@/components/Label';
import RemoveIcon from '@/components/ListManager/components/RemoveIcon';
import VariablesInput from '@/components/VariablesInput';
import { useExpressionValidation } from '@/hooks';

import ConditionExpressionTooltip from './ConditionExpressionTooltip';

const VariablesInputComponent: any = VariablesInput;

export interface ConditionExpressionProps {
  expression: Realtime.ExpressionV2;
  onChange: (value: Realtime.ExpressionV2) => void;
  onDelete: () => void;
}

const ConditionExpression: React.FC<ConditionExpressionProps> = ({ expression, onChange, onDelete }) => {
  const [error, resetError, isValidExpression, errorMessage] = useExpressionValidation();

  const onUpdate = React.useCallback(
    ({ text }: { text: string }) => {
      if (!text) return;

      if (isValidExpression(text)) {
        resetError();
        onChange({ ...expression, value: text } as Realtime.ExpressionV2);
      }
    },
    [isValidExpression, expression.value, onChange]
  );

  return (
    <Box mb={3}>
      <Box mb={11}>
        <BoxFlex>
          <Label inline>Expression</Label>
          <Box ml={6}>
            <ConditionExpressionTooltip />
          </Box>
        </BoxFlex>
      </Box>

      <BoxFlex fullWidth>
        <VariablesInputComponent
          error={error}
          onFocus={resetError}
          value={expression.value}
          onBlur={onUpdate}
          placeholder="Enter Expression"
          multiline
          skipBlurOnUnmount
          fullWidth
        />
        <RemoveIcon onClick={onDelete} />
      </BoxFlex>

      {error && (
        <Box fontSize={13} color="#e91e63" mt={16}>
          {errorMessage ? `Error: ${errorMessage}.` : 'Expression syntax is invalid.'}
        </Box>
      )}
    </Box>
  );
};

export default ConditionExpression;
