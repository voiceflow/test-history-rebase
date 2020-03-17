import React from 'react';

import { SearchableListItemContainer } from '@/components/SearchableList';

import ItemCount from '../../ItemCount';
import { Intent } from '../types';

export type DraggableItemProps = {
  item: Intent;
  isDragging?: boolean;
  selectedID: string;
  withoutHover?: boolean;
  onContextMenu?: React.MouseEventHandler;
  onSelectIntent: (id: string) => void;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
};

const DraggableItem: React.FC<DraggableItemProps> = (
  { item, isDragging, isDraggingPreview, selectedID, withoutHover, onSelectIntent, onContextMenu, isContextMenuOpen },
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <SearchableListItemContainer
      ref={ref}
      onClick={() => onSelectIntent(item.id)}
      isActive={selectedID === item.id}
      isDragging={isDragging}
      withoutHover={withoutHover}
      onContextMenu={onContextMenu}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      <span>{item.name}</span>
      {!!item.inputs?.length && <ItemCount>{item.inputs.length}</ItemCount>}
    </SearchableListItemContainer>
  );
};

export default React.forwardRef(DraggableItem);
