import composeRef from '@seznam/compose-react-refs';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useExpressionValidator } from '@/components/ConditionsBuilder/hooks';
import type {
  DragPreviewComponentProps,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from '@/components/DraggableList';
import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { Diagram } from '@/ducks';
import { useAutoScrollNodeIntoView } from '@/hooks';
import { useVariableCreateModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

export interface DraggableItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<Realtime.NodeData.SetExpressionV2>,
    MappedItemComponentHandlers<Realtime.NodeData.SetExpressionV2> {
  editor: NodeEditorV2Props<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const DraggableItem: React.ForwardRefRenderFunction<HTMLElement, DraggableItemProps> = (
  {
    item,
    index,
    editor,
    itemKey,
    isDragging,
    onContextMenu,
    onUpdate,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const variablesMap = useSelector(Diagram.active.entitiesAndVariablesMapSelector);

  const variableCreateModal = useVariableCreateModal();

  const createVariable = async (name: string): Promise<string> => {
    const variable = await variableCreateModal.open({ name, folderID: null });

    return variable.id;
  };

  const expressionValidator = useExpressionValidator();

  const updateExpression = ({ text: expression }: { text: string }) => {
    if (!expression.trim() || !expressionValidator.validate(expression)) return;

    onUpdate({ expression });
  };

  const autofocus = latestCreatedKey === itemKey || editor.data.sets.length === 1;

  const [sectionRef, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({
    condition: autofocus,
    options: { block: 'end' },
  });

  return (
    <EditorV2.PersistCollapse namespace={['setEditorListItem', item.id]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {!isDraggingPreview && index !== 0 && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header
                    ref={connectedDragRef}
                    sticky
                    sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}
                  >
                    <SectionV2.Title bold={!collapsed}>
                      Set{' '}
                      {item.variable
                        ? `{${variablesMap[item.variable]?.name ?? item.variable}}`
                        : `variable ${index + 1}`}{' '}
                    </SectionV2.Title>

                    <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                  </SectionV2.Header>
                }
                onToggle={onToggle}
                onEntered={() => scrollSectionIntoView({ block: 'nearest' })}
                collapsed={collapsed}
                isDragging={isDragging}
                onContextMenu={onContextMenu}
                containerToggle
                isDraggingPreview={isDraggingPreview}
                isContextMenuOpen={isContextMenuOpen}
              >
                {!isDragging && !isDraggingPreview && (
                  <SectionV2.Content bottomOffset={3}>
                    <VariableSelectV2
                      value={item.variable}
                      prefix="APPLY TO"
                      onCreate={createVariable}
                      onChange={(variable) => onUpdate({ variable })}
                      placeholder="Select variable"
                    />

                    <Box mt="16px">
                      <VariablesInput
                        error={!!expressionValidator.error}
                        value={String(item.expression)}
                        onBlur={updateExpression}
                        onFocus={expressionValidator.resetError}
                        multiline
                        placeholder="Enter value, {variable} or expression"
                      />

                      {expressionValidator.error && (
                        <Box fontSize={13} color="#BD425F" mt={12}>
                          {expressionValidator.error}
                        </Box>
                      )}
                    </Box>
                  </SectionV2.Content>
                )}
              </SectionV2.CollapseSection>
            )}
          </SectionV2.Sticky>
        </>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem);
