import { useCache } from '@voiceflow/ui';
import React from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';

import { useThrottledCallback } from '@/hooks/callback';
import { useForceUpdate } from '@/hooks/forceUpdate';
import { useTeardown } from '@/hooks/lifecycle';
import { useRAF } from '@/hooks/raf';
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
    willChange: 'translate',
    transform: `translate(${horizontalEnabled ? x : initialOffset.x}px, ${y}px)`,
  };
};

type DragLayerPreviewProps<I> = {
  getOptions: (type: string) => undefined | Partial<Options>;
  renderPreview: (type: string, item: I) => React.ReactNode;
};

const DragLayerPreview = <I extends any>({ getOptions, renderPreview }: DragLayerPreviewProps<I>): JSX.Element => {
  const previewRef = React.useRef<HTMLDivElement>(null);

  const [updateStyles] = useRAF();
  const [forceUpdate, updateKey] = useForceUpdate();
  const cache = useCache({ getOptions });

  const throttledForceUpdate = useThrottledCallback(FORCE_UPDATE_THROTTLE_TIME, forceUpdate, [], { leading: false });

  const { item, itemType } = useDragLayer((monitor) => {
    const type = monitor.getItemType() as string;

    if (previewRef.current) {
      const options = { ...DEFAULT_OPTIONS, ...cache.current.getOptions(type) };

      updateStyles(() => {
        if (previewRef.current) {
          Object.assign(previewRef.current.style, getPreviewStyle(monitor.getInitialSourceClientOffset(), monitor.getSourceClientOffset(), options));

          throttledForceUpdate();
        }
      });
    }

    return {
      item: monitor.getItem(),
      itemType: type,
    };
  });

  const children = React.useMemo(() => renderPreview(itemType, item), [item, renderPreview, itemType, updateKey]);

  useTeardown(() => throttledForceUpdate.cancel, [throttledForceUpdate]);

  return <div ref={previewRef}>{children}</div>;
};

export default DragLayerPreview;
