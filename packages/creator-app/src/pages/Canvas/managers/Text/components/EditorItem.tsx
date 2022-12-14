import composeRef from '@seznam/compose-react-refs';
import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Divider, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import { SlateTextInput } from '@/components/SlateInputs';
import { useActiveProjectTypeConfig, useAutoScrollNodeIntoView } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import MessageDelayButton from '@/pages/Canvas/components/MessageDelayButton';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

export interface EditorItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<BaseNode.Text.TextData>,
    MappedItemComponentHandlers<BaseNode.Text.TextData> {
  editor: NodeEditorV2Props<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const EditorItem: React.ForwardRefRenderFunction<HTMLElement, EditorItemProps> = (
  { item, index, editor, itemKey, isDragging, onContextMenu, onUpdate, latestCreatedKey, connectedDragRef, isDraggingPreview, isContextMenuOpen },
  ref
) => {
  const autofocus = latestCreatedKey === itemKey || editor.data.texts.length === 1;
  const [sectionRef, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  const config = useActiveProjectTypeConfig();

  return (
    <EditorV2.PersistCollapse namespace={['text-editor-item', item.id]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && !isDraggingPreview && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed || isDragging || isDraggingPreview}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header ref={connectedDragRef} sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}>
                    <SectionV2.Title bold={!collapsed}>Text variant {index + 1}</SectionV2.Title>
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
                  <SectionV2.Content padding="24px 32px" paddingTop={0}>
                    <SlateTextInput
                      value={item.content}
                      onBlur={(value) => onUpdate({ content: value })}
                      options={config.project.chat.toolbarOptions}
                      extraToolbarButtons={
                        config.project.chat.messageDelay && (
                          <>
                            <Divider height={15} offset={4} isVertical />

                            <MessageDelayButton
                              delay={item.messageDelayMilliseconds}
                              onChange={(messageDelayMilliseconds) => onUpdate({ messageDelayMilliseconds })}
                            />
                          </>
                        )
                      }
                    />
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

export default React.forwardRef<HTMLElement, EditorItemProps>(EditorItem);
