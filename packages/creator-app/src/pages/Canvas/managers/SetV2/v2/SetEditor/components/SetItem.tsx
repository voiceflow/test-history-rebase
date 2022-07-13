import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { useAutoScrollNodeIntoView, useVariableCreation } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useSetItem } from '@/pages/Canvas/managers/SetV2/hooks';

import { NodeEditorV2Props } from '../../../../types';

export interface SetItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<Realtime.NodeData.SetExpressionV2>,
    MappedItemComponentHandlers<Realtime.NodeData.SetExpressionV2> {
  editor: NodeEditorV2Props<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const SetItem: React.ForwardRefRenderFunction<HTMLElement, SetItemProps> = (
  { item, index, editor, itemKey, isDragging, onContextMenu, onUpdate, latestCreatedKey, connectedDragRef, isDraggingPreview, isContextMenuOpen },
  ref
) => {
  const { error, errorMessage, resetError, updateExpression, updateVariable } = useSetItem({ item, onUpdate });

  const autofocus = latestCreatedKey === itemKey || editor.data.sets.length === 1;

  const { variables, createVariable } = useVariableCreation();
  const [sectionRef, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

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
                  <SectionV2.Header ref={connectedDragRef} sticky sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}>
                    <SectionV2.Title bold={!collapsed}>Set {item.variable ? `{${item.variable}}` : `variable ${index + 1}`} </SectionV2.Title>

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
                      options={variables}
                      onCreate={createVariable}
                      onChange={updateVariable}
                      placeholder="Select variable"
                    />

                    <Box mt="16px">
                      <VariablesInput
                        placeholder="Enter value, {variable} or expression"
                        error={error}
                        onFocus={resetError}
                        value={String(item.expression)}
                        onBlur={({ text }) => updateExpression(text)}
                        multiline
                      />

                      {error && (
                        <Box fontSize={13} color="#e91e63" mt={12}>
                          {errorMessage ? `Error: ${errorMessage}.` : 'Expression syntax is invalid.'}
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

export default React.forwardRef<HTMLElement, SetItemProps>(SetItem);
