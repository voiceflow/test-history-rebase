import type { Markup } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Surface, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import VariableSelectV2 from '@/components/VariableSelectV2';
import { useVariableCreateModal } from '@/hooks/modal.hook';

interface ISetV3EditorItemSubEditor {
  item: Realtime.NodeData.SetExpressionV2;
  onUpdateExpression: (value: Markup) => void;
  onUpdateVariable: (variable: string) => void;
  expressionValidator: {
    error: string;
    validate: (text: string, isSetV3?: boolean) => boolean;
    resetError: () => void;
  };
}

export const SetV3EditorItemSubEditor: React.FC<ISetV3EditorItemSubEditor> = ({
  item,
  onUpdateExpression,
  onUpdateVariable,
  expressionValidator,
}) => {
  const [expression, setExpression] = React.useState<Markup>([String(item.expression)]);
  const variableCreateModal = useVariableCreateModal();

  const createVariable = async (name: string): Promise<string> => {
    const variable = await variableCreateModal.open({ name, folderID: null });

    return variable.id;
  };

  return (
    <Surface width={350}>
      <Box px={24} py={24} direction="column">
        <Box direction="column" gap={12}>
          <Box gap={3} direction="column">
            <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
              Variable
            </Text>
            <VariableSelectV2
              value={item.variable}
              onCreate={createVariable}
              onChange={onUpdateVariable}
              placeholder="Select variable"
            />
          </Box>

          <Box gap={3} direction="column">
            <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
              Set to
            </Text>
            <InputWithVariables
              placeholder="Enter value, {var} or expression"
              value={expression}
              onValueChange={setExpression}
              onFocus={expressionValidator.resetError}
              onBlur={() => onUpdateExpression(expression)}
              error={!!expressionValidator.error}
            />
          </Box>

          {expressionValidator.error && (
            <Box mt={12}>
              <Text variant="caption" color="#BD425F">
                {expressionValidator.error}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Surface>
  );
};
