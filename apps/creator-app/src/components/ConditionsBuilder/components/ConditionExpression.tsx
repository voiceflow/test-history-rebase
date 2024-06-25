import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Label from '@/components/Label';
import VariablesInput from '@/components/VariablesInput';

import { useExpressionValidator } from '../hooks';
import ConditionExpressionTooltip from './ConditionExpressionTooltip';

export interface ConditionExpressionProps {
  expression: Realtime.ExpressionV2;
  onChange: (value: Realtime.ExpressionV2) => void;
  onDelete: () => void;
}

const ConditionExpression: React.FC<ConditionExpressionProps> = ({ expression, onChange, onDelete }) => {
  const expressionValidator = useExpressionValidator();

  const onUpdate = React.useCallback(
    ({ text }: { text: string }) => {
      if (!text || !expressionValidator.validate(text)) return;

      onChange({ ...expression, value: text } as Realtime.ExpressionV2);
    },
    [expressionValidator.validate, expression.value, onChange]
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
          error={!!expressionValidator.error}
          value={String(expression.value)}
          onBlur={onUpdate}
          onFocus={expressionValidator.resetError}
          multiline
          fullWidth
          placeholder="Enter Expression"
          skipBlurOnUnmount
        />

        <SectionV2.RemoveButton onClick={onDelete} />
      </Box.Flex>

      {expressionValidator.error && (
        <Box fontSize={13} color="#BD425F" mt={16}>
          {expressionValidator.error}
        </Box>
      )}
    </Box>
  );
};

export default ConditionExpression;
