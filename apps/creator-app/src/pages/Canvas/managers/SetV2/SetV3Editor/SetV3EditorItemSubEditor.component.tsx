import type { Markup, Variable } from '@voiceflow/dtos';
import { IconName } from '@voiceflow/icons';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Surface, Text, Tokens } from '@voiceflow/ui-next';
import { isMarkupEmpty, markupFactory } from '@voiceflow/utils-designer';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { VariableSelect } from '@/components/Variable/VariableSelect/VariableSelect.component';
import { Diagram } from '@/ducks';
import { useSelector } from '@/hooks';

import { surfaceStyles } from './SetV3EditorItemSubEditor.css';

interface ISetV3EditorItemSubEditor {
  item: Realtime.NodeData.SetExpressionV2;
  isJustAdded: boolean;
  onUpdateExpression: (value: Markup) => void;
  onUpdateVariable: (variable: string) => void;
  onSetAnother?: () => void;
  expressionValidator: {
    error: string;
    validate: (text: string, isSetV3?: boolean) => boolean;
    resetError: () => void;
  };
}

export const SetV3EditorItemSubEditor: React.FC<ISetV3EditorItemSubEditor> = ({
  item,
  isJustAdded,
  onUpdateExpression,
  onUpdateVariable,
  onSetAnother,
  expressionValidator,
}) => {
  const variablesMap = useSelector(Diagram.active.entitiesAndVariablesMapSelector);

  const expressionError = React.useMemo(() => {
    if (expressionValidator.error) return expressionValidator.error;

    if (!isJustAdded && !item.expression) return 'Value is required';

    return '';
  }, [expressionValidator.error, item.expression, isJustAdded]);

  const expression = React.useMemo(() => markupFactory(String(item.expression)), [item.expression]);
  const [isExpressionEmpty, setIsExpressionEmpty] = React.useState<boolean>(isMarkupEmpty(expression));

  const onFocusExpressionInput = () => {
    expressionValidator.resetError();
  };

  const onSelectVariable = (variable: Variable) => {
    onUpdateVariable(variable.id);
  };

  return (
    <Surface width={350} px={4} pt={20} pb={item.variable && isExpressionEmpty ? 24 : 4} className={surfaceStyles}>
      <Box direction="column" px={20}>
        <VariableSelect
          variableID={item.variable ? variablesMap[item.variable]?.id : null}
          onSelect={onSelectVariable}
          label="Variable"
          error={!isJustAdded && !item.variable}
          prefixIcon={!item.variable ? ('ArrowRight' as IconName) : undefined}
        />
        {!isJustAdded && !item.variable && (
          <Box pt={6}>
            <Text variant="caption" color={Tokens.colors.alert.alert700}>
              Variable to set is required.
            </Text>
          </Box>
        )}
      </Box>
      <Box gap={6} direction="column" mt={16} px={20} pb={item.variable && isExpressionEmpty ? 0 : 16}>
        <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
          Set to
        </Text>
        <InputWithVariables
          placeholder="Enter value, {var} or expression"
          value={expression}
          onValueChange={onUpdateExpression}
          onValueEmpty={setIsExpressionEmpty}
          onFocus={onFocusExpressionInput}
          error={!!expressionError}
        />

        {expressionError && (
          <Box>
            <Text variant="caption" color={Tokens.colors.alert.alert700}>
              {expressionError}
            </Text>
          </Box>
        )}
      </Box>

      {item.variable && !isExpressionEmpty && !expressionValidator.error && onSetAnother && (
        <Button variant="secondary" label="Set another" fullWidth onClick={onSetAnother} />
      )}
    </Surface>
  );
};
