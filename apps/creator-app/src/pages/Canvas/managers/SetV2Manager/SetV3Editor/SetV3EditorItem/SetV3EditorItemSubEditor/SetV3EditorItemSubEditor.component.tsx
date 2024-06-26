import type { Markup, Variable } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Scroll, Text, Tokens, usePopperContext } from '@voiceflow/ui-next';
import { isMarkupEmpty, markupToExpression } from '@voiceflow/utils-designer';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { PopperDynamicSurface } from '@/components/Popper/PopperDynamicSurface/PopperDynamicSurface.component';
import { VariableSelect } from '@/components/Variable/VariableSelect/VariableSelect.component';
import { Designer, Diagram } from '@/ducks';
import { useSelector } from '@/hooks';
import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';
import { stopPropagation } from '@/utils/handler.util';

import { buttonStyles, surfaceStyles } from './SetV3EditorItemSubEditor.css';

interface ISetV3EditorItemSubEditor {
  item: Realtime.NodeData.SetExpressionV2;
  isJustAdded: boolean;
  onUpdateExpression: (value: Markup) => void;
  onUpdateVariable: (variable: string) => void;
  onSetAnother: () => void;
  expressionValidator: {
    error: string;
    validate: (text: string, isSetV3?: boolean) => boolean;
    resetError: () => void;
  };
  update: VoidFunction;
}

export const SetV3EditorItemSubEditor: React.FC<ISetV3EditorItemSubEditor> = ({
  item,
  isJustAdded,
  onUpdateExpression,
  onUpdateVariable,
  onSetAnother,
  expressionValidator,
  update,
}) => {
  const variablesMap = useSelector(Diagram.active.entitiesAndVariablesMapSelector);
  const variablesMapByName = useSelector(Designer.Variable.selectors.mapByName);
  const [isExpressionInputActive, setIsExpressionInputActive] = React.useState(false);
  const popperContext = usePopperContext();

  const [expression, setExpression] = React.useState(() =>
    markupToExpression.toDB(String(item.expression), {
      variablesMapByName,
      entitiesMapByName: {},
    })
  );
  const [isExpressionEmpty, setIsExpressionEmpty] = React.useState(() => isMarkupEmpty(expression));

  useHotkey(Hotkey.MODAL_SUBMIT, onSetAnother, {
    allowInputs: true,
    preventDefault: true,
  });

  const expressionError = React.useMemo(() => {
    if (expressionValidator.error) return expressionValidator.error;

    if (!isJustAdded && (!item.expression || isExpressionEmpty) && !isExpressionInputActive)
      return 'Value is required.';

    return '';
  }, [expressionValidator.error, item.expression, isJustAdded, isExpressionInputActive]);

  const onFocusExpressionInput = () => {
    setIsExpressionInputActive(true);
    expressionValidator.resetError();
  };

  const onValueChange = (value: Markup) => {
    setExpression(value);
    onUpdateExpression(value);
  };

  const onBlurExpressionInput = () => {
    setIsExpressionInputActive(false);
  };

  const onSelectVariable = (variable: Variable) => {
    onUpdateVariable(variable.id);
  };

  return (
    <PopperDynamicSurface
      width="350px"
      update={update}
      overflow="hidden"
      maxHeight={`${popperContext.portalNode.clientHeight - 32}px`}
      onPointerDown={stopPropagation()}
      className={surfaceStyles}
    >
      <Scroll maxHeight={'calc(100% - 64px)'}>
        <Box direction="column" px={4} pt={20} pb={(item.variable && isExpressionEmpty) || expressionError ? 24 : 4}>
          <Box direction="column" px={20}>
            <VariableSelect
              variableID={item.variable ? variablesMap[item.variable]?.id : null}
              onSelect={onSelectVariable}
              label="Variable"
              error={!isJustAdded && !item.variable ? 'Variable to set is required.' : undefined}
              prefixIcon={!item.variable ? ('ArrowRight' as IconName) : undefined}
            />
          </Box>
          <Box direction="column" mt={16}>
            <Box px={20} mb={6}>
              <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
                Set to
              </Text>
            </Box>
            <Box>
              <Box width={20} />
              <InputWithVariables
                placeholder="Enter value, {var} or expression"
                value={expression}
                onValueChange={onValueChange}
                onBlur={onBlurExpressionInput}
                onFocus={onFocusExpressionInput}
                onValueEmpty={setIsExpressionEmpty}
                error={!!expressionError}
                maxVariableWidth="250px"
              />
              <Box width={20} />
            </Box>
            <Box height={(item.variable && isExpressionEmpty) || expressionError ? 0 : 20} />

            {expressionError && (
              <Box px={20} pt={6}>
                <Text variant="fieldCaption" color={Tokens.colors.alert.alert700}>
                  {expressionError}
                </Text>
              </Box>
            )}
          </Box>

          {item.variable && !isExpressionEmpty && !expressionValidator.error && (
            <Button variant="secondary" className={buttonStyles} label="Set another" fullWidth onClick={onSetAnother} />
          )}
        </Box>
      </Scroll>
    </PopperDynamicSurface>
  );
};
