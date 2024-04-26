import React from 'react';
import type { ListChildComponentProps } from 'react-window';

import { useDraggableListChildrenContext } from '@/components/DraggableList';

import type { ComponentItem } from './hooks';

const VirtualListItem: React.FC<ListChildComponentProps<ComponentItem[]>> = ({ index, data, style }) => {
  const item = data[index];
  const { renderItem } = useDraggableListChildrenContext();

  return (
    <div style={style}>
      {renderItem({
        key: item.id,
        item,
        index,
        isLast: index === data.length - 1,
        isFirst: index === 0,
        itemKey: item.id,
      })}
    </div>
  );
};

export default VirtualListItem;
