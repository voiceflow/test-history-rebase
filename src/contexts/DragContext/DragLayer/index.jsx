import React from 'react';
import { useDragLayer } from 'react-dnd';

import { Container, Preview } from './components';

const DragLayer = ({ isRegistered, renderPreview, getOptions }) => {
  const { isDragging, itemType } = useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !isRegistered(itemType)) {
    return null;
  }

  return (
    <Container>
      <Preview getOptions={getOptions} renderPreview={renderPreview} />
    </Container>
  );
};

export default DragLayer;
