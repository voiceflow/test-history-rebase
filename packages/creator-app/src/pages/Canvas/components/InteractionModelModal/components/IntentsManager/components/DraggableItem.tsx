import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import { SearchableListItemContainer } from '@/components/SearchableList';
import { Intent } from '@/models';
import { isCustomizeableBuiltInIntent } from '@/utils/intent';

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
) => {
  const isBuiltIn = isCustomizeableBuiltInIntent(item);
  return (
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
      <ItemCount>
        {isBuiltIn && 'Built-in '}
        {!isBuiltIn && !!item.inputs?.length && <>{item.inputs.length}</>}
      </ItemCount>{' '}
    </SearchableListItemContainer>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem as any);
