import React from 'react';

import { SearchableListItemContainer } from '@/components/SearchableList';

import ItemCount from '../../ItemCount';

export type DraggableItemProps = {
  item: string;
  isLocal?: boolean;
  isBuiltIn?: boolean;
  isDragging?: boolean;
  withoutHover?: boolean;
  onContextMenu?: React.MouseEventHandler;
  onSelectVariable: (id: string) => void;
  selectedVariable: string;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
};

const DraggableItem: React.FC<DraggableItemProps> = (
  { item, isLocal, isBuiltIn, isDragging, withoutHover, onContextMenu, onSelectVariable, selectedVariable, isContextMenuOpen, isDraggingPreview },
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <SearchableListItemContainer
      ref={ref}
      onClick={() => onSelectVariable(item)}
      isActive={selectedVariable === item}
      isDragging={isDragging}
      withoutHover={withoutHover}
      onContextMenu={onContextMenu}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      <span>{item}</span>
      {(isLocal || isBuiltIn) && <ItemCount>{isBuiltIn ? 'Built In' : 'Local'}</ItemCount>}
    </SearchableListItemContainer>
  );
};

export default React.forwardRef(DraggableItem);
