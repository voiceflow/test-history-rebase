import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import { SearchableListItemContainer } from '@/components/SearchableList';
import { VariableTag } from '@/components/VariableTag';
import { VariableType } from '@/constants';
import { OrderedVariable } from '@/hooks';

import ItemCount from '../../ItemCount';

export type DraggableItemProps = Omit<ItemComponentProps<OrderedVariable>, 'connectedDragRef' | 'onRemove'> &
  DragPreviewComponentProps & {
    withoutHover?: boolean;
    onSelectVariableID?: (id: string) => void;
    selectedVariableID?: string;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, DraggableItemProps> = (
  { item, isDragging, withoutHover, onContextMenu, onSelectVariableID, selectedVariableID, isContextMenuOpen, isDraggingPreview },
  ref
) => {
  const isLocal = item.type === VariableType.LOCAL;
  const isBuiltIn = item.type === VariableType.BUILT_IN;

  return (
    <SearchableListItemContainer
      ref={ref}
      onClick={() => onSelectVariableID?.(item.id)}
      isActive={selectedVariableID === item.id}
      isDragging={isDragging}
      withoutHover={withoutHover}
      onContextMenu={onContextMenu}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      <VariableTag inheritedCursor>{item.name}</VariableTag>

      {(isLocal || isBuiltIn) && <ItemCount>{isBuiltIn ? 'Built In' : 'Flow'}</ItemCount>}
    </SearchableListItemContainer>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem as any);
