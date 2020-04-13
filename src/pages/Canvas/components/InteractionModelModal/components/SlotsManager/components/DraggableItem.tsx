import React from 'react';

import { SearchableListItemContainer } from '@/components/SearchableList';
import { SlotTag } from '@/components/VariableTag';

import ItemCount from '../../ItemCount';
import { Slot } from '../types';

export type DraggableItemProps = {
  item: Slot;
  isDragging?: boolean;
  selectedID: string;
  onSelectSlot: (id: string) => void;
  withoutHover?: boolean;
  onContextMenu?: React.MouseEventHandler;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
};

const DraggableItem: React.FC<DraggableItemProps> = (
  { item, isDragging, isDraggingPreview, selectedID, withoutHover, onSelectSlot, onContextMenu, isContextMenuOpen },
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <SearchableListItemContainer
      ref={ref}
      onClick={() => onSelectSlot(item.id)}
      isActive={selectedID === item.id}
      isDragging={isDragging}
      withoutHover={withoutHover}
      onContextMenu={onContextMenu}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      <SlotTag color={item.color}>{item.name}</SlotTag>
      <ItemCount>{item.type?.replace('AMAZON.', '') ?? ''}</ItemCount>
    </SearchableListItemContainer>
  );
};

export default React.forwardRef(DraggableItem);
