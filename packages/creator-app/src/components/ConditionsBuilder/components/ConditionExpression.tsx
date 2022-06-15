import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import Label from '@/components/Label';
import RemoveIcon from '@/components/ListManager/components/RemoveIcon';
import VariablesInput from '@/components/VariablesInput';
import { useExpressionValidation } from '@/hooks';

import ConditionExpressionTooltip from './ConditionExpressionTooltip';

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
        <Box.Flex>
          <Label inline>Expression</Label>
          <Box ml={6}>
            <ConditionExpressionTooltip />
          </Box>
        </Box.Flex>
      </Box>

      <Box.Flex fullWidth>
        <VariablesInput
          error={error}
          value={expression.value as string}
          onBlur={onUpdate}
          onFocus={resetError}
          multiline
          fullWidth
          placeholder="Enter Expression"
          skipBlurOnUnmount
        />

        <RemoveIcon onClick={onDelete} />
      </Box.Flex>

      {error && (
        <Box fontSize={13} color="#e91e63" mt={16}>
          {errorMessage ? `Error: ${errorMessage}.` : 'Expression syntax is invalid.'}
        </Box>
      )}
    </Box>
  );
};

export default ConditionExpression;
