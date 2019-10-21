import React from 'react';

const dragLayerStyles = (initialOffset, currentOffset, horizontalEnabled) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  return {
    transform: `translate(${horizontalEnabled ? x : initialOffset.x}px, ${y}px)`,
  };
};

const DragLayerPreviewContianer = ({ initialOffset, currentOffset, horizontalEnabled, children }) => (
  <div style={dragLayerStyles(initialOffset, currentOffset, horizontalEnabled)}>{children}</div>
);

export default DragLayerPreviewContianer;
