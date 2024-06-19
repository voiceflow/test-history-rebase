import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Surface, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { useVariableCreateModal } from '@/hooks/modal.hook';

interface ISetV2EditorItemSubEditor {
  item: Realtime.NodeData.SetExpressionV2;
  onUpdateExpression: ({ text }: { text: string }) => void;
  onUpdateVariable: (variable: string) => void;
  expressionValidator: {
    error: string;
    validate: (text: string, isSetV3?: boolean) => boolean;
    resetError: () => void;
  };
}

export const SetV2EditorItemSubEditor: React.FC<ISetV2EditorItemSubEditor> = ({
  item,
  onUpdateExpression,
  onUpdateVariable,
  expressionValidator,
}) => {
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
            <VariablesInput
              error={!!expressionValidator.error}
              value={String(item.expression)}
              onBlur={onUpdateExpression}
              onFocus={expressionValidator.resetError}
              multiline
              placeholder="Enter value, {variable} or expression"
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
