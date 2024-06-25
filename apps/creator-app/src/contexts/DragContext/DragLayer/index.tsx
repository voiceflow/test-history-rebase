import React from 'react';
import { useDragLayer } from 'react-dnd';

import type { PreviewOptions } from './components';
import { Container, Preview } from './components';

export type { PreviewOptions };

interface DragLayerProps<I> {
  getOptions: (type: string) => undefined | Partial<PreviewOptions>;
  isRegistered: (type: string) => boolean;
  renderPreview: (type: string, item: I) => React.ReactNode;
}

const DragLayer = <I,>({ isRegistered, renderPreview, getOptions }: DragLayerProps<I>) => {
  const { isDragging, itemType } = useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !isRegistered(itemType as string)) {
    return null;
  }

  return (
    <Container>
      <Preview getOptions={getOptions} renderPreview={renderPreview} />
    </Container>
  );
};

export default DragLayer;
