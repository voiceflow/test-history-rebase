import React from 'react';
import { useDragLayer } from 'react-dnd';

import { DragContext } from '@/contexts';

import { Container, Preview } from './components';

const DEFAULT_OPTIONS = {
  horizontalEnabled: false,
};

const DragLayer = () => {
  const { isRegistered, renderPreview, getOptions } = React.useContext(DragContext);

  const { isDragging, item, itemType, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !isRegistered(itemType)) {
    return null;
  }

  const { horizontalEnabled } = { ...DEFAULT_OPTIONS, ...getOptions(itemType) };

  return (
    <Container>
      <Preview initialOffset={initialOffset} currentOffset={currentOffset} horizontalEnabled={horizontalEnabled}>
        {renderPreview(itemType, item)}
      </Preview>
    </Container>
  );
};

export default DragLayer;
