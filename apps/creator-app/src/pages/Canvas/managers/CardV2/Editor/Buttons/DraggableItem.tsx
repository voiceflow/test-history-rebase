import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

import { PATH } from './constants';

export interface CardV2EditorButtonsDraggableItemProps
  extends ItemComponentProps<Realtime.NodeData.CardV2.Button>,
    DragPreviewComponentProps,
    MappedItemComponentHandlers<Realtime.NodeData.CardV2.Button> {
  editor: NodeEditorV2Props<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts>;
}

const CardV2EditorButtonsDraggableItem: React.ForwardRefRenderFunction<HTMLElement, CardV2EditorButtonsDraggableItemProps> = (
  { item: button, editor, onRemove, isDragging, connectedDragRef, isDraggingPreview, onContextMenu, isContextMenuOpen },
  ref
) => {
  // eslint-disable-next-line xss/no-mixed-html
  return (
    <div ref={ref as React.Ref<HTMLDivElement>}>
      <SectionV2.ListItem
        isDragging={isDragging}
        isDraggingPreview={isDraggingPreview}
        ref={connectedDragRef as React.Ref<HTMLDivElement>}
        icon="button"
        isActive={isContextMenuOpen}
        action={isDraggingPreview ? null : <SectionV2.RemoveButton onClick={!isDragging ? onRemove : undefined} />}
        onClick={() => editor.goToNested({ path: PATH, params: { buttonID: button.id } })}
        onContextMenu={onContextMenu}
      >
        {transformVariablesToReadable(button.name || 'Button Label')}
      </SectionV2.ListItem>
    </div>
  );
};

export default React.forwardRef(CardV2EditorButtonsDraggableItem);
