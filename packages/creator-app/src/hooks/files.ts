import { Utils } from '@voiceflow/common';
import React from 'react';

export interface Dimensions {
  width: number;
  height: number;
  ratio: number;
}

export function useImageDimensions({ url, disabled = false }: { url?: string | null; disabled?: boolean }) {
  const [dimensions, setDimensions] = React.useState<Dimensions | null>(null);

  React.useLayoutEffect(() => {
    if (!disabled && url) {
      const image = new Image();
      image.src = String(url);
      image.onload = (event: Event) => {
        if (!Utils.object.isObject(event) || !('path' in event) || !Array.isArray(event.path)) return;
        const [{ height, width }] = event.path;

        if (!Number.isFinite(width) || !Number.isFinite(height)) return;

        setDimensions({ width, height, ratio: (height / width) * 100 });
      };
    }
  }, [url, disabled]);

  return dimensions;
}
