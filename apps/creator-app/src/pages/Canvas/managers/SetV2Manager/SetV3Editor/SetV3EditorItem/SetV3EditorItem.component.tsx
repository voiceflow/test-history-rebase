import { useDndContext } from '@dnd-kit/core';
import type { Markup } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, EditorButton, Popper, useConst, usePopperContext } from '@voiceflow/ui-next';
import { markupToExpression } from '@voiceflow/utils-designer';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { useExpressionValidator } from '@/components/ConditionsBuilder/hooks';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import { stopPropagation } from '@/utils/handler.util';

import { expressionToString } from '../../SetV3.util';
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
  const variablesMap = useSelector(Designer.Variable.selectors.map);
  const variablesMapByName = useSelector(Designer.Variable.selectors.mapByName);

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [label, setLabel] = React.useState<string>(item.label || '');

  const variable = item.variable ? variablesMap[item.variable].name : 'Set variable';
  const expressionValidator = useExpressionValidator();

  const popperContext = usePopperContext();
  const dndContext = useDndContext();

  const modifiers = useConst([
    { name: 'preventOverflow', options: { boundary: popperContext.portalNode, padding: 16 } },
    { name: 'offset', options: { offset: [0, 1] } },
  ]);

  const getEditorButtonLabel = () => {
    if (item.label) return '';

    if (item.variable && item.expression) {
      return variablesMap[item.variable].name;
    }

    if (item.variable) {
      return `Set ${variable} to...`;
    }

    return 'Set variable';
  };

  const updateExpression = (item: Realtime.NodeData.SetExpressionV2) => (value: Markup) => {
    const expression = markupToExpression.fromDB(value, {
      variablesMapByID: variablesMap,
      entitiesMapByID: {},
    });

    if (!expression.trim() || !expressionValidator.validate(expression)) return;

    onChange(item.id, { ...item, expression });
  };

  const updateVariable = (item: Realtime.NodeData.SetExpressionV2) => (variableID: string) => {
    onChange(item.id, { ...item, variable: variableID });
  };

  const updateLabel = () => {
    setIsEditing(false);
    if (label && !!label.trim()) {
      onChange(item.id, { ...item, label: label.trim() });
    } else {
      onChange(item.id, { ...item, label: '' });
      setLabel('');
    }
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
      return 'Variable and value are missing';
    }

    if (!item.variable) {
      return 'Variable is missing';
    }

    if (!item.expression) {
      return 'Value is missing';
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
        <Box ref={popperRef} width="100%" pl={12}>
          <SetV3EditorItemContextMenu
            onDuplicate={onDuplicate ? () => onDuplicate?.(item.id) : undefined}
            onRename={() => onStartRename()}
            onRemove={() => onRemove(item.id)}
            referenceElement={({ ref: contextMenuPopperRef, onContextMenu, isOpen: isContextMenuOpen }) => (
              <Box ref={contextMenuPopperRef} width="100%">
                <CMSFormListItem
                  width="100%"
                  align="center"
                  gap={4}
                  onRemove={() => onRemove(item.id)}
                  onContextMenu={onContextMenu}
                >
                  <EditorButton
                    fullWidth
                    prefixIconName="Set"
                    buttonClassName={editorButtonStyle({ isDragging: !!dndContext?.active })}
                    isWarning={!!error}
                    warningTooltipContent={error}
                    displayedLabel={label}
                    isEditing={isEditing}
                    label={getEditorButtonLabel()}
                    secondLabel={
                      item.label ? undefined : expressionToString(String(item.expression), variablesMapByName)
                    }
                    onClick={isEditing ? undefined : onOpen}
                    isActive={isOpen || isEditing || isContextMenuOpen}
                    isEmpty={!item.variable && !item.expression && !item.label}
                    inputPlaceholder="Add label"
                    onEdit={setLabel}
                    onInputBlur={updateLabel}
                    onInputKeyDown={handleKeyDown}
                    warningTooltipMaxWidth={130}
                    onPointerDown={isEditing ? stopPropagation() : undefined}
                  />
                </CMSFormListItem>
              </Box>
            )}
          />
        </Box>
      )}
    >
      {({ update }) => (
        <SetV3EditorItemSubEditor
          item={item}
          isJustAdded={isJustAdded}
          onUpdateExpression={updateExpression(item)}
          onUpdateVariable={updateVariable(item)}
          onSetAnother={onSetAnother}
          expressionValidator={expressionValidator}
          update={update}
        />
      )}
    </Popper>
  );
};
