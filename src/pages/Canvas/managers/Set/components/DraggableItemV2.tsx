import React from 'react';

import Badge from '@/components/Badge';
import { Flex } from '@/components/Box';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import Section, { SectionToggleVariant } from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { NodeData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';

import ExpressionInputTooltip from './ExpressionInputTooltip';

const VariablesInputComponent: any = VariablesInput;

export type SetItemProps = ItemComponentProps<NodeData.SetExpression> &
  MappedItemComponentHandlers<NodeData.SetExpression> &
  DragPreviewComponentProps & {
    latestCreatedKey: string | undefined;
    isOnlyItem: boolean;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, SetItemProps> = (
  { itemKey, item, index, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef, onContextMenu, isContextMenuOpen },
  ref
) => {
  const updateExpression = React.useCallback(
    (text) => {
      onUpdate({ expression: text });
    },
    [item.expression, onUpdate]
  );

  const updateVariable = React.useCallback((variable) => onUpdate({ variable }), [onUpdate]);
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
                <Flex fullWidth>
                  Assign Value to Variable
                  <ExpressionInputTooltip />
                </Flex>
              }
            >
              <VariablesInputComponent
                value={item.expression}
                onBlur={({ text }: { text: string }) => updateExpression(text)}
                placeholder="Enter value, {variable} or expression"
                multiline
              />
            </FormControl>
          </Section>
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef<HTMLElement, SetItemProps>(DraggableItem as any);
