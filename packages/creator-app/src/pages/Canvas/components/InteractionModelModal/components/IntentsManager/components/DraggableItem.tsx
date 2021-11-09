import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import { IntentName, SearchableListItemContainer } from '@/components/SearchableList';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import ItemCount from '../../ItemCount';

export type DraggableItemProps = ItemComponentProps<Realtime.Intent> &
  DragPreviewComponentProps & {
    selectedID?: string;
    withoutHover?: boolean;
    onSelectIntent?: (id: string) => void;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, DraggableItemProps> = (
  { item, isDragging, isDraggingPreview, selectedID, withoutHover, onSelectIntent, onContextMenu, isContextMenuOpen },
  ref
) => {
  const isBuiltIn = isCustomizableBuiltInIntent(item);
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
      <IntentName>{item.name}</IntentName>
      <ItemCount>
        {isBuiltIn && 'Built-in '}
        {!isBuiltIn && !!item.inputs?.length && <>{item.inputs.length}</>}
      </ItemCount>{' '}
    </SearchableListItemContainer>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem as any);
