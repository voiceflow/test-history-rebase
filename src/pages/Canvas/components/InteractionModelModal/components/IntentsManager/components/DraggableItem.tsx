import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import { SearchableListItemContainer } from '@/components/SearchableList';
import { Intent } from '@/models';

import ItemCount from '../../ItemCount';

export type DraggableItemProps = ItemComponentProps<Intent> &
  DragPreviewComponentProps & {
    selectedID?: string;
    withoutHover?: boolean;
    onSelectIntent?: (id: string) => void;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, DraggableItemProps> = (
  { item, isDragging, isDraggingPreview, selectedID, withoutHover, onSelectIntent, onContextMenu, isContextMenuOpen },
  ref
) => (
  <SearchableListItemContainer
    ref={ref}
    onClick={() => onSelectIntent?.(item.id)}
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

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem as any);
