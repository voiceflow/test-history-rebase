import React from 'react';
import { useDragLayer } from 'react-dnd';

import { Container, Preview, PreviewContainer } from './components';

const DragLayer = () => {
  const { isDragging, item, initialOffset, currentOffset, horizontalEnabled } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  return (
    <Container>
      <PreviewContainer initialOffset={initialOffset} currentOffset={currentOffset} horizontalEnabled={horizontalEnabled}>
        <Preview item={item} />
      </PreviewContainer>
    </Container>
  );
};

export default DragLayer;
