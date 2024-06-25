import { useCache, useForceUpdate, useRAF, useThrottledCallback } from '@voiceflow/ui';
import React from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { useTeardown } from '@/hooks/lifecycle';

export interface Options<I = any> {
  horizontalEnabled?: boolean | ((item: I, initialOffset: XYCoord, currentOffset: XYCoord) => boolean);
}

const DEFAULT_OPTIONS: Options<any> = {
  horizontalEnabled: false,
};

interface DragLayerPreviewProps<I> {
  getOptions: (type: string) => undefined | Options<I>;
  renderPreview: (type: string, item: I) => React.ReactNode;
}

const DragLayerPreview = <I,>({ getOptions, renderPreview }: DragLayerPreviewProps<I>): JSX.Element => {
  const previewRef = React.useRef<HTMLDivElement>(null);

  const [updateStyles] = useRAF();
  const [forceUpdate, updateKey] = useForceUpdate();
  const cache = useCache({ getOptions });

  const throttledForceUpdate = useThrottledCallback(HOVER_THROTTLE_TIMEOUT, forceUpdate, [], { leading: false });

  const { item, itemType } = useDragLayer((monitor) => {
    const type = monitor.getItemType() as string;
    const item = monitor.getItem();

    const collected = { item, itemType: type };

    const node = previewRef.current;

    if (!node || !item) {
      return collected;
    }

    const initialOffset = monitor.getInitialSourceClientOffset();
    const currentOffset = monitor.getSourceClientOffset();

    let { isDraggingXEnabled } = item;

    if (!initialOffset || !currentOffset) {
      isDraggingXEnabled = false;
    } else {
      const horizontalEnabled = cache.current.getOptions(type)?.horizontalEnabled ?? DEFAULT_OPTIONS.horizontalEnabled;

      isDraggingXEnabled =
        typeof horizontalEnabled === 'function'
          ? horizontalEnabled(item, initialOffset, currentOffset)
          : horizontalEnabled;
    }

    item.isDraggingXEnabled = isDraggingXEnabled;
    item.setIsDraggingXEnabled?.(isDraggingXEnabled);

    throttledForceUpdate();

    updateStyles(() => {
      if (!initialOffset || !currentOffset) {
        node.style.display = 'none';
        return;
      }

      node.style.display = 'block';
      node.style.transform = `translate(${isDraggingXEnabled ? currentOffset.x : initialOffset.x}px, ${currentOffset.y}px)`;
      node.style.willChange = 'translate';
    });

    return collected;
  });

  const children = React.useMemo(() => renderPreview(itemType, item), [item, renderPreview, itemType, updateKey]);

  useTeardown(() => throttledForceUpdate.cancel, [throttledForceUpdate]);

  return <div ref={previewRef}>{children}</div>;
};

export default DragLayerPreview;
