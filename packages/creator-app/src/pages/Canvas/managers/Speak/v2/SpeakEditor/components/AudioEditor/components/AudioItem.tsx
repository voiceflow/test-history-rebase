import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import VariablesInput from '@/components/VariablesInput';
import { useAutoScrollNodeIntoView } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

export interface AudioItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<Realtime.AudioData>,
    MappedItemComponentHandlers<Realtime.AudioData> {
  editor: NodeEditorV2Props<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const AudioItem: React.ForwardRefRenderFunction<HTMLElement, AudioItemProps> = (
  { item, index, editor, itemKey, isDragging, onContextMenu, onUpdate, latestCreatedKey, connectedDragRef, isDraggingPreview, isContextMenuOpen },
  ref
) => {
  const autofocus = latestCreatedKey === itemKey || editor.data.dialogs.length === 1;
  const [sectionRef, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  return (
    <EditorV2.PersistCollapse namespace={['speak-audio-editor-item', item.id]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && !isDraggingPreview && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed || isDragging || isDraggingPreview}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header ref={connectedDragRef} sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}>
                    <SectionV2.Title bold={!collapsed}>Audio variant {index + 1}</SectionV2.Title>
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
                <SectionV2.Content padding="24px 32px" paddingTop={0}>
                  <UploadV2.Audio
                    value={item.url}
                    onChange={(value) => onUpdate({ url: value ?? undefined })}
                    renderInput={VariablesInput.renderInput}
                  />
                </SectionV2.Content>
              </SectionV2.CollapseSection>
            )}
          </SectionV2.Sticky>
        </>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default React.forwardRef<HTMLElement, AudioItemProps>(AudioItem);
