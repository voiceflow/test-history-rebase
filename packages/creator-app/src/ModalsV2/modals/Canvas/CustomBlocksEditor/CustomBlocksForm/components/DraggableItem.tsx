import { Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';

import { PathData } from './Editor';

export interface DraggableItemProps extends DragPreviewComponentProps, ItemComponentProps<PathData>, MappedItemComponentHandlers<PathData> {}

const DraggableItem: React.ForwardRefRenderFunction<HTMLElement, DraggableItemProps> = (
  { item, onUpdate, onRemove, isDragging, isDraggingPreview, onContextMenu, isContextMenuOpen },
  ref
) => {
  // eslint-disable-next-line xss/no-mixed-html
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} style={{ marginBottom: '12px' }}>
      <SectionV2.ListItem
        isDragging={isDragging}
        isDraggingPreview={isDraggingPreview}
        isActive={isContextMenuOpen}
        action={isDraggingPreview ? null : <SectionV2.RemoveButton onClick={!isDragging ? onRemove : undefined} disabled={item.isDefault} />}
        onContextMenu={onContextMenu}
      >
        <Input
          value={item.label}
          placeholder="Enter path label"
          onChange={(event) => onUpdate({ label: event.target.value, isDefault: item.isDefault })}
        />
      </SectionV2.ListItem>
    </div>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem);
