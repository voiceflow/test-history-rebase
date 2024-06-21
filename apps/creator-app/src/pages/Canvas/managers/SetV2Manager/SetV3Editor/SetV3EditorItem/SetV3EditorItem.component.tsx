import type { Markup } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, EditorButton, Popper, useConst, usePopperContext } from '@voiceflow/ui-next';
import { markupToString } from '@voiceflow/utils-designer';
import { useAtomValue } from 'jotai';
import React from 'react';

import { variablesMapByIDAtom } from '@/atoms/variable.atom';
import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { useExpressionValidator } from '@/components/ConditionsBuilder/hooks';

import { editorButtonStyle } from './SetV3EditorItem.css';
import { SetV3EditorItemContextMenu } from './SetV3EditorItemContextMenu.component';
import { SetV3EditorItemSubEditor } from './SetV3EditorItemSubEditor/SetV3EditorItemSubEditor.component';

const SET_STEP_VARIABLE_TEST_ID = 'set-step-variable';

interface ISetV3EditorItem {
  item: Realtime.NodeData.SetExpressionV2;
  onChange: (itemID: string, item: Partial<Realtime.NodeData.SetExpressionV2>) => void;
  onRemove: (itemID: string) => void;
  onDuplicate?: (itemID: string) => void;
  isJustAdded: boolean;
  onSetAnother: VoidFunction;
  onSubEditorClose: (itemID: string) => void;
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
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [label, setLabel] = React.useState<string>(item.label || '');

  const variable = item.variable ? variablesMap[item.variable].name : 'Set variable';
  const expressionValidator = useExpressionValidator();

  const popperContext = usePopperContext();
  const modifiers = useConst([
    { name: 'preventOverflow', options: { boundary: popperContext.portalNode, padding: 16 } },
  ]);

  const getEditorButtonLabel = () => {
    if (item.label || label) return item.label || label;

    if (item.variable && item.expression) {
      return item.variable;
    }

    if (item.variable) {
      return `Set ${variable} to...`;
    }

    return 'Set variable';
  };

  const updateExpression = (item: Realtime.NodeData.SetExpressionV2) => (value: Markup) => {
    const expression = markupToString.fromDB(value, { variablesMapByID: variablesMap, entitiesMapByID: {} });

    if (!expression.trim() || !expressionValidator.validate(expression)) return;

    onChange(item.id, { ...item, expression });
  };

  const updateVariable = (item: Realtime.NodeData.SetExpressionV2) => (variableID: string) => {
    onChange(item.id, { ...item, variable: variableID });
  };

  const updateLabel = () => {
    setIsEditing(false);
    onChange(item.id, { ...item, label });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateLabel();
    }
  };

  const onStartRename = () => {
    setIsEditing(true);
  };

  const getError = () => {
    if (isJustAdded) return '';

    if (!item.variable && !item.expression) {
      return 'Variable and value are missing.';
    }

    if (!item.variable) {
      return 'Variable is missing.';
    }

    if (!item.expression) {
      return 'Value is missing.';
    }

    if (expressionValidator.error) {
      return expressionValidator.error;
    }

    return '';
  };

  const error = getError();

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
            onRename={() => onStartRename()}
            onRemove={() => onRemove(item.id)}
            referenceElement={({ ref: contextMenuPopperRef, onContextMenu }) => (
              <Box ref={contextMenuPopperRef} width="100%" pr={16} pl={12}>
                <CMSFormListItem width="100%" pr={0} onRemove={() => onRemove(item.id)} onContextMenu={onContextMenu}>
                  <EditorButton
                    fullWidth
                    prefixIconName="Set"
                    buttonClassName={editorButtonStyle}
                    isWarning={!!error}
                    warningTooltipContent={error}
                    displayedLabel={label}
                    isEditing={isEditing}
                    label={getEditorButtonLabel()}
                    secondLabel={item.label || label ? '' : String(item.expression)}
                    onClick={isEditing ? undefined : onOpen}
                    isActive={isOpen || isEditing}
                    isEmpty={!item.variable && !item.expression && !item.label && !label}
                    onEdit={setLabel}
                    onInputBlur={updateLabel}
                    onInputKeyDown={handleKeyDown}
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
