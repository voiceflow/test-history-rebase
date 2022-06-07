import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, BoxFlex, Input, Text } from '@voiceflow/ui';
import React from 'react';

import { ConditionExpressionTooltip } from '@/components/ConditionsBuilder/components';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant } from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';
import { useSetItem } from '@/pages/Canvas/managers/SetV2/hooks';

const INPUT_TYPE_OPTIONS = [
  {
    id: BaseNode.Utils.ExpressionTypeV2.VALUE,
    label: <Text>Value</Text>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.ADVANCE,
    label: <Text>Variable or Expression</Text>,
  },
];

export type SetItemProps = ItemComponentProps<Realtime.NodeData.SetExpressionV2> &
  MappedItemComponentHandlers<Realtime.NodeData.SetExpressionV2> &
  DragPreviewComponentProps & {
    latestCreatedKey: string | undefined;
    isOnlyItem: boolean;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, SetItemProps> = (
  { itemKey, item, index, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef, onContextMenu, isContextMenuOpen },
  ref
) => {
  const { error, errorMessage, resetError, updateExpression, updateVariable } = useSetItem({ item, onUpdate });
  const isNew = latestCreatedKey === itemKey;

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
              {item.type === BaseNode.Utils.ExpressionTypeV2.VALUE ? (
                <Input value={String(item.expression)} onChangeText={(value) => onUpdate({ expression: value })} placeholder="Enter value" />
              ) : (
                <VariablesInput
                  error={error}
                  onFocus={resetError}
                  value={String(item.expression)}
                  onBlur={({ text }: { text: string }) => updateExpression(text)}
                  placeholder="Enter {variable} or expression"
                  multiline
                />
              )}
            </Box>
            {error && item.type === BaseNode.Utils.ExpressionTypeV2.ADVANCE && (
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
