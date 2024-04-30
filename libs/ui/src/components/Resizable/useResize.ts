import React from 'react';

import { useRAF } from '@/hooks';

import type { ResizeManagerOptions } from './manager';
import { useResizeManager } from './manager';

interface ResizeOptions extends ResizeManagerOptions {}

export default function useResize({ axis, ...options }: ResizeOptions) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [updateStylesScheduler] = useRAF();

  const onResize = ([width, height]: [number, number]) => {
    updateStylesScheduler(() => {
      if (!containerRef.current) return;
      if (width !== undefined) containerRef.current.style.width = `${width}px`;
      if (height !== undefined) containerRef.current.style.height = `${height}px`;
    });
  };

  const manager = useResizeManager({ axis, ...options, onResize });

  return {
    containerRef,
    onMouseDown: manager.onMouseDown,
  };
}
