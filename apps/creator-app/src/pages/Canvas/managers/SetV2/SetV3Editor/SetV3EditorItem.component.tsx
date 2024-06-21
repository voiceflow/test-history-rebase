import type { Markup } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, EditorButton, Popper, useConst, usePopperContext } from '@voiceflow/ui-next';
import { markupToString } from '@voiceflow/utils-designer';
import { useAtomValue } from 'jotai';
import React from 'react';

import { variablesMapByIDAtom } from '@/atoms/variable.atom';
import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { useExpressionValidator } from '@/components/ConditionsBuilder/hooks';

import { SetV3EditorItemContextMenu } from './SetV3EditorItemContextMenu.component';
import { SetV3EditorItemSubEditor } from './SetV3EditorItemSubEditor.component';

const SET_STEP_VARIABLE_TEST_ID = 'set-step-variable';

interface ISetV3EditorItem {
  item: Realtime.NodeData.SetExpressionV2;
  isJustAdded: boolean;
  onChange: (itemID: string, item: Partial<Realtime.NodeData.SetExpressionV2>) => void;
  onDuplicate?: (itemID: string) => void;
  onRemove: (itemID: string) => void;
  onSubEditorClose: (itemID: string) => void;
  onSetAnother: VoidFunction;
}

export const SetV3EditorItem: React.FC<ISetV3EditorItem> = ({
  item,
  isJustAdded,
  onChange,
  onDuplicate,
  onRemove,
  onSubEditorClose,
  onSetAnother,
}) => {
  const variablesMap = useAtomValue(variablesMapByIDAtom);
  const [error, setError] = React.useState<string>('');

  const popperContext = usePopperContext();
  const modifiers = useConst([
    { name: 'preventOverflow', options: { boundary: popperContext.portalNode, padding: 16 } },
  ]);

  const expressionValidator = useExpressionValidator();

  const updateExpression = (item: Realtime.NodeData.SetExpressionV2) => (value: Markup) => {
    const expression = markupToString.fromDB(value, { variablesMapByID: variablesMap, entitiesMapByID: {} });

    if (!expression.trim() || !expressionValidator.validate(expression)) return;

    onChange(item.id, { ...item, expression });
  };

  const updateVariable = (item: Realtime.NodeData.SetExpressionV2) => (variableID: string) => {
    onChange(item.id, { ...item, variable: variableID });
  };

  React.useEffect(() => {
    if (isJustAdded) return;

    if (!item.variable && !item.expression) {
      setError('Variable and value are missing.');
    } else if (!item.variable) {
      setError('Variable is missing.');
    } else if (!item.expression) {
      setError('Value is missing.');
    } else if (expressionValidator.error) {
      setError(expressionValidator.error);
    } else {
      setError('');
    }
  }, [item, expressionValidator]);

  return (
    <Popper
      placement="left-start"
      modifiers={modifiers}
      testID={SET_STEP_VARIABLE_TEST_ID}
      onClose={() => onSubEditorClose(item.id)}
      isOpen={isJustAdded}
      referenceElement={({ ref: popperRef, isOpen, onOpen }) => (
        <Box ref={popperRef} width="100%">
          <SetV3EditorItemContextMenu
            onDuplicate={onDuplicate ? () => onDuplicate?.(item.id) : undefined}
            onRename={() => {
              onChange(item.id, { ...item });
            }}
            onRemove={() => onRemove(item.id)}
            referenceElement={({ ref: contextMenuPopperRef, onContextMenu }) => (
              <Box ref={contextMenuPopperRef} width="100%" pr={16} pl={12} onContextMenu={onContextMenu}>
                <CMSFormListItem width="100%" pr={0} onRemove={() => onRemove(item.id)}>
                  <EditorButton
                    fullWidth
                    prefixIconName="Set"
                    label={item.variable ? variablesMap[item.variable].name : 'Set variable'}
                    secondLabel={String(item.expression)}
                    onClick={onOpen}
                    isActive={isOpen}
                    isEmpty={!item.variable && !item.expression}
                    isWarning={!!error}
                    warningTooltipContent={error}
                  />
                </CMSFormListItem>
              </Box>
            )}
          />
        </Box>
      )}
    >
      {() => (
        <SetV3EditorItemSubEditor
          item={item}
          isJustAdded={isJustAdded}
          onUpdateExpression={updateExpression(item)}
          onUpdateVariable={updateVariable(item)}
          onSetAnother={isJustAdded ? onSetAnother : undefined}
          expressionValidator={expressionValidator}
        />
      )}
    </Popper>
  );
};
