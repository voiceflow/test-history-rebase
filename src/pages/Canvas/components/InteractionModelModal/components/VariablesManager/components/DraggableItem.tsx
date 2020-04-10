import React from 'react';

import { SearchableListItemContainer } from '@/components/SearchableList';
import { VariableTag } from '@/components/VariableTag';

import ItemCount from '../../ItemCount';
import { VariableType } from '../constants';
import { Variable } from '../types';

export type DraggableItemProps = {
  item: Variable;
  isDragging?: boolean;
  withoutHover?: boolean;
  onContextMenu?: React.MouseEventHandler;
  onSelectVariableID: (id: string) => void;
  selectedVariableID?: string;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
};

const DraggableItem: React.FC<DraggableItemProps> = (
  { item, isDragging, withoutHover, onContextMenu, onSelectVariableID, selectedVariableID, isContextMenuOpen, isDraggingPreview },
  ref: React.Ref<HTMLDivElement>
) => {
  const isLocal = item.type === VariableType.LOCAL;
  const isBuiltIn = item.type === VariableType.BUILT_IN;

  return (
    <SearchableListItemContainer
      ref={ref}
      onClick={() => onSelectVariableID(item.id)}
      isActive={selectedVariableID === item.id}
      isDragging={isDragging}
      withoutHover={withoutHover}
      onContextMenu={onContextMenu}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      <VariableTag>{`{${item.name}}`}</VariableTag>
      {(isLocal || isBuiltIn) && <ItemCount>{isBuiltIn ? 'Built In' : 'Flow'}</ItemCount>}
    </SearchableListItemContainer>
  );
};

export default React.forwardRef(DraggableItem);
