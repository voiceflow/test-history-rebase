import { ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import Badge from '@/components/Badge';
import Box, { Flex } from '@/components/Box';
import { ConditionExpressionTooltip } from '@/components/ConditionsBuilder/components';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import Input from '@/components/Input';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant } from '@/components/Section';
import Text from '@/components/Text';
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
      if (isValidExpression(text)) {
        resetError();
        onUpdate({ expression: text });
      }
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
                  Value Type
                  <ConditionExpressionTooltip />
                </Flex>
              }
            >
              <RadioGroup options={INPUT_TYPE_OPTIONS} checked={item.type} onChange={(type) => onUpdate({ type })} />
            </FormControl>
            <Box mt={12}>
              {item.type === ExpressionTypeV2.VALUE ? (
                <Input
                  value={transformVariableToString(`${item.expression}`)}
                  onChange={({ target }) => onUpdate({ expression: target.value as NodeData.NewExpressionType })}
                  placeholder="Enter value"
                />
              ) : (
                <VariablesInputComponent
                  error={error}
                  onFocus={resetError}
                  value={`${item.expression}`}
                  onBlur={({ text }: { text: string }) => updateExpression(text)}
                  placeholder="Enter {variable} or expression"
                  multiline
                />
              )}
            </Box>
            {error && (
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
