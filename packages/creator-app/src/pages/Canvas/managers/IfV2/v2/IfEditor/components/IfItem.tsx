/* eslint-disable jsx-a11y/no-autofocus */
import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import ConditionsBuilder from '@/components/ConditionsBuilder';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import { useAutoScrollNodeIntoView } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

export interface IfItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<Realtime.ExpressionData>,
    MappedItemComponentHandlers<Realtime.ExpressionData> {
  editor: NodeEditorV2Props<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const IfItem: React.ForwardRefRenderFunction<HTMLElement, IfItemProps> = (
  { isDragging, item, index, latestCreatedKey, itemKey, editor, isDraggingPreview, connectedDragRef, onContextMenu, isContextMenuOpen, onUpdate },
  ref
) => {
  const autofocus = latestCreatedKey === itemKey || editor.data.expressions.length === 1;
  const [sectionRef, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  return (
    <EditorV2.PersistCollapse namespace={['setEditorListItem', itemKey]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header ref={connectedDragRef} sticky sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}>
                    <SectionV2.Title bold={!collapsed}>{item.name || `Condition ${index + 1}`}</SectionV2.Title>

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
                <SectionV2.Content bottomOffset={2.5}>
                  <Input value={item.name} placeholder="Enter condition label" onChangeText={(name) => onUpdate({ name })} autoFocus />
                </SectionV2.Content>

                <SectionV2.Divider inset />

                <SectionV2.SimpleSection>
                  <ConditionsBuilder expression={item} onChange={onUpdate} style={{ padding: 0 }} />
                </SectionV2.SimpleSection>
              </SectionV2.CollapseSection>
            )}
          </SectionV2.Sticky>
        </>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default React.forwardRef<HTMLElement, IfItemProps>(IfItem);
