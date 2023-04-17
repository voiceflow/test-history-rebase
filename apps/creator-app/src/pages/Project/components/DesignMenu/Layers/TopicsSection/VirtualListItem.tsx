import React from 'react';
import { ListChildComponentProps } from 'react-window';

import { useDraggableListChildrenContext } from '@/components/DraggableList';

import { TopicItem } from './hooks';

const VirtualListItem: React.FC<ListChildComponentProps<TopicItem[]>> = ({ index, data, style }) => {
  const item = data[index];
  const { renderItem } = useDraggableListChildrenContext();

  return (
    <div style={style}>
      {renderItem({
        key: item.topicID,
        item,
        index,
        isLast: index === data.length - 1,
        isFirst: index === 0,
        itemKey: item.topicID,
      })}
    </div>
  );
};

export default VirtualListItem;
