import React from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';

import { useCache } from '@/hooks/cache';
import { useThrottledCallback } from '@/hooks/callback';
import { useForceUpdate } from '@/hooks/forceUpdate';
import { Nullable } from '@/types';

const FORCE_UPDATE_THROTTLE_TIME = 200;

export type Options = {
  horizontalEnabled: boolean;
};

const DEFAULT_OPTIONS: Options = {
  horizontalEnabled: false,
};

const getPreviewStyle = (initialOffset: Nullable<XYCoord>, currentOffset: Nullable<XYCoord>, { horizontalEnabled }: Options) => {
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

type DragLayerPreviewProps<I> = {
  getOptions: (type: string) => undefined | Partial<Options>;
  renderPreview: (type: string, item: I) => React.ReactNode;
};

const DragLayerPreview = <I extends any>({ getOptions, renderPreview }: DragLayerPreviewProps<I>): JSX.Element => {
  const previewRef = React.useRef<HTMLDivElement>(null);

  const [forceUpdate] = useForceUpdate();
  const cache = useCache(
    {
      item: null as Nullable<I>,
      monitor: null as Nullable<DragLayerMonitor>,
      itemType: null as Nullable<string | null>,
      getOptions,
      renderPreview,
    },
    { getOptions, renderPreview }
  );

  const throttledForceUpdate = useThrottledCallback(FORCE_UPDATE_THROTTLE_TIME, forceUpdate, [], { leading: false });

  const { item, itemType } = useDragLayer((monitor) => {
    const type = monitor.getItemType() as string;

    cache.current.monitor = monitor;

    if (previewRef.current) {
      const options = { ...DEFAULT_OPTIONS, ...cache.current.getOptions(type) };

      Object.assign(previewRef.current.style, getPreviewStyle(monitor.getInitialSourceClientOffset(), monitor.getSourceClientOffset(), options));

      throttledForceUpdate();
    }

    return {
      item: monitor.getItem(),
      itemType: type,
    };
  });

  cache.current = { ...cache.current, item, itemType };

  return <div ref={previewRef}>{cache.current.renderPreview(cache.current.itemType!, cache.current.item!)}</div>;
};

export default DragLayerPreview;
