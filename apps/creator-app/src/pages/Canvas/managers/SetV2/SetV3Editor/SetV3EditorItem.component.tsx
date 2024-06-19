import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, EditorButton, Popper, useConst, usePopperContext } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { Diagram } from '@/ducks';
import { useExpressionValidator, useSelector } from '@/hooks';

import { SetV3EditorItemContextMenu } from './SetV3EditorItemContextMenu.component';
import { SetV3EditorItemSubEditor } from './SetV3EditorItemSubEditor.component';

const SET_STEP_VARIABLE_TEST_ID = 'set-step-variable';

interface ISetV3EditorItem {
  item: Realtime.NodeData.SetExpressionV2;
  isJustAdded: boolean;
  onChange: (itemID: string, item: Partial<Realtime.NodeData.SetExpressionV2>) => void;
  onDuplicate?: (itemID: string) => void;
  onRemove: (itemID: string) => void;
  onSubEditorClose: VoidFunction;
}

export const SetV3EditorItem: React.FC<ISetV3EditorItem> = ({
  item,
  isJustAdded,
  onChange,
  onDuplicate,
  onRemove,
  onSubEditorClose,
}) => {
  const variablesMap = useSelector(Diagram.active.entitiesAndVariablesMapSelector);
  const [error, setError] = React.useState<string>('');

  const popperContext = usePopperContext();
  const modifiers = useConst([
    { name: 'preventOverflow', options: { boundary: popperContext.portalNode, padding: 16 } },
  ]);

  const expressionValidator = useExpressionValidator();

  const updateExpression =
    (item: Realtime.NodeData.SetExpressionV2) =>
    ({ text: expression }: { text: string }) => {
      if (!expression.trim() || !expressionValidator.validate(expression)) return;

      onChange(item.id, { expression });
    };

  const updateVariable = (item: Realtime.NodeData.SetExpressionV2) => (variable: string) => {
    onChange(item.id, { ...item, variable });
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
      onClose={onSubEditorClose}
      isOpen={isJustAdded}
      referenceElement={({ ref: popperRef, isOpen, onOpen }) => (
        <Box ref={popperRef} width="100%">
          <SetV3EditorItemContextMenu
            onDuplicate={onDuplicate ? () => onDuplicate?.(item.id) : undefined}
            onRename={() => {
              onChange(item.id, { ...item, variable: '' });
            }}
            onRemove={() => onRemove(item.id)}
            referenceElement={({ ref: contextMenuPopperRef, onContextMenu }) => (
              <Box ref={contextMenuPopperRef} width="100%" pr={16} pl={12} onContextMenu={onContextMenu}>
                <CMSFormListItem width="100%" pr={0} onRemove={() => onRemove(item.id)}>
                  <EditorButton
                    fullWidth
                    prefixIconName="Set"
                    label={item.variable ? variablesMap[item.variable].name : 'Set variable'}
                    secondLabel={`${item.expression}`}
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
          onUpdateExpression={updateExpression(item)}
          onUpdateVariable={updateVariable(item)}
          expressionValidator={expressionValidator}
        />
      )}
    </Popper>
  );
};
