import composeRef from '@seznam/compose-react-refs';
import { clsx } from '@voiceflow/style';
import { forwardRef, Surface, useResizeObserver } from '@voiceflow/ui-next';
import React, { useRef } from 'react';

import type { IPopperDynamicSurface } from './PopperDynamicSurface.interface';

export const PopperDynamicSurface = forwardRef<HTMLDivElement, IPopperDynamicSurface>('PopperDynamicSurface')((
  { update, className, ...props },
  ref
) => {
  const surfaceRef = useRef<HTMLDivElement>(null);

  useResizeObserver({
    ref: surfaceRef,
    onResize: () => update(),
  });

  return <Surface ref={composeRef(surfaceRef, ref)} className={clsx('vfui', className)} {...props} />;
});
