import { ExpressionTypeV2 } from '@voiceflow/general-types';
import { Badge, Box, BoxFlex, Input, Text, useDidUpdateEffect } from '@voiceflow/ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { ConditionExpressionTooltip } from '@/components/ConditionsBuilder/components';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant } from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { useExpressionValidation } from '@/hooks';
import { NodeData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';
import { transformVariableToString } from '@/utils/slot';

const VariablesInputComponent: any = VariablesInput;
const INPUT_TYPE_OPTIONS = [
  {
    id: ExpressionTypeV2.VALUE,
    label: <Text>Value</Text>,
  },
  {
    id: ExpressionTypeV2.ADVANCE,
    label: <Text>Variable or Expression</Text>,
  },
];

export type SetItemProps = ItemComponentProps<NodeData.SetExpressionV2> &
  MappedItemComponentHandlers<NodeData.SetExpressionV2> &
  DragPreviewComponentProps & {
    latestCreatedKey: string | undefined;
    isOnlyItem: boolean;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, SetItemProps> = (
  { itemKey, item, index, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef, onContextMenu, isContextMenuOpen },
  ref
) => {
  const [error, resetError, isValidExpression, errorMessage] = useExpressionValidation();

  const updateExpression = React.useCallback(
    (text) => {
      if (!isEmpty(text) && isValidExpression(text)) {
        resetError();
        onUpdate({ expression: text });
      }
    },
    [item.expression, onUpdate]
  );

  const updateVariable = React.useCallback((variable) => onUpdate({ variable }), [onUpdate]);
  const isNew = latestCreatedKey === itemKey;

  useDidUpdateEffect(() => {
    if (item.type === ExpressionTypeV2.VALUE) {
      onUpdate({ expression: transformVariableToString(String(item.expression)) });
    }
    resetError();
  }, [item.type]);

  return (
    <EditorSection
      ref={ref}
      namespace={['setItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header="Set"
      prefix={<Badge>{index + 1}</Badge>}
      headerRef={connectedDragRef}
      collapseVariant={(!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW) || null}
      isDragging={isDragging}
      headerToggle
      isDraggingPreview={isDraggingPreview}
      onContextMenu={onContextMenu}
      isContextMenuOpen={isContextMenuOpen}
      customContentStyling={{ padding: '0px' }}
    >
      {isDragging || isDraggingPreview ? null : (
        <>
          <Section customContentStyling={{ paddingTop: '0px' }}>
            <PrefixedVariableSelect searchable value={item.variable} onChange={updateVariable} />
          </Section>
          <Section isDividerNested>
            <FormControl
              contentBottomUnits={0}
              label={
                <BoxFlex fullWidth>
                  Value Type
                  <ConditionExpressionTooltip />
                </BoxFlex>
              }
            >
              <RadioGroup
                options={INPUT_TYPE_OPTIONS}
                checked={item.type}
                onChange={(type) =>
                  onUpdate({
                    type,
                  })
                }
              />
            </FormControl>
            <Box mt={12}>
              {item.type === ExpressionTypeV2.VALUE ? (
                <Input
                  value={String(item.expression)}
                  onChange={({ target }) => onUpdate({ expression: target.value as NodeData.NewExpressionType })}
                  placeholder="Enter value"
                />
              ) : (
                <VariablesInputComponent
                  error={error}
                  onFocus={resetError}
                  value={String(item.expression)}
                  onBlur={({ text }: { text: string }) => updateExpression(text)}
                  placeholder="Enter {variable} or expression"
                  multiline
                />
              )}
            </Box>
            {error && item.type === ExpressionTypeV2.ADVANCE && (
              <Box fontSize={13} color="#e91e63" mt={16}>
                {errorMessage ? `Error: ${errorMessage}.` : 'Expression syntax is invalid.'}
              </Box>
            )}
          </Section>
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef<HTMLElement, SetItemProps>(DraggableItem as any);
