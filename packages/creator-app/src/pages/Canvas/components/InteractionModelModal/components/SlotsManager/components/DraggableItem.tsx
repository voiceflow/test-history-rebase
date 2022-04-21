import * as Realtime from '@voiceflow/realtime-sdk';
import { Tag } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import { SearchableListItemContainer } from '@/components/SearchableList';

import ItemCount from '../../ItemCount';

export type DraggableItemProps = ItemComponentProps<Realtime.Slot> &
  DragPreviewComponentProps & {
    selectedID?: string;
    onSelectSlot?: (id: string) => void;
    withoutHover?: boolean;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, DraggableItemProps> = (
  { item, isDragging, isDraggingPreview, selectedID, withoutHover, onSelectSlot, onContextMenu, isContextMenuOpen },
  ref
) => (
  <SearchableListItemContainer
    ref={ref}
    onClick={() => onSelectSlot?.(item.id)}
    isActive={selectedID === item.id}
    isDragging={isDragging}
    withoutHover={withoutHover}
    onContextMenu={onContextMenu}
    isDraggingPreview={isDraggingPreview}
    isContextMenuOpen={isContextMenuOpen}
  >
    <Tag color={item.color}>{`{${item.name}}`}</Tag>

    {item.type && <ItemCount style={{ marginLeft: '12px' }}>{item.type?.replace('AMAZON.', '') ?? ''}</ItemCount>}
  </SearchableListItemContainer>
);

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem as any);
