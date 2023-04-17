import React from 'react';

import { imageSizeFromUrl } from '@/utils/file';

export interface Dimensions {
  width: number;
  height: number;
  ratio: number;
}

export function useImageDimensions({ url, disabled = false }: { url?: string | null; disabled?: boolean }) {
  const [dimensions, setDimensions] = React.useState<Dimensions | null>(null);

  React.useLayoutEffect(() => {
    if (!disabled && url) {
      imageSizeFromUrl(url)
        .then(({ width, height }) => setDimensions({ width, height, ratio: (height / width) * 100 }))
        .catch(() => {});
    }
  }, [url, disabled]);

  return dimensions;
}
