import React from 'react';
import { useDragLayer } from 'react-dnd';

import { useThrottledCallback } from '@/hooks/callback';
import { useForceUpdate } from '@/hooks/forceUpdate';

const FORCE_UPDATE_THROTTLE_TIME = 200;

const DEFAULT_OPTIONS = {
  horizontalEnabled: false,
};

const getPreviewStyle = (initialOffset, currentOffset, horizontalEnabled) => {
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

const DragLayerPreview = ({ getOptions, renderPreview }) => {
  const cache = React.useRef({});
  const previewRef = React.useRef();

  const [forceUpdate] = useForceUpdate();

  cache.current = { ...cache.current, getOptions, renderPreview };

  const throttledForceUpdate = useThrottledCallback(FORCE_UPDATE_THROTTLE_TIME, forceUpdate, [], { leading: false });

  const { item, itemType } = useDragLayer((monitor) => {
    const type = monitor.getItemType();
    cache.current.monitor = monitor;

    if (previewRef.current) {
      const { horizontalEnabled } = { ...DEFAULT_OPTIONS, ...cache.current.getOptions(type) };

      Object.assign(
        previewRef.current.style,
        getPreviewStyle(monitor.getInitialSourceClientOffset(), monitor.getSourceClientOffset(), horizontalEnabled)
      );

      throttledForceUpdate();
    }

    return {
      item: monitor.getItem(),
      itemType: type,
    };
  });

  cache.current = { ...cache.current, item, itemType };

  return <div ref={previewRef}>{cache.current.renderPreview(cache.current.itemType, cache.current.item)}</div>;
};

export default DragLayerPreview;
