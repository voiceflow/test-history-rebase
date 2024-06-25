import React from 'react';

import type { ColorPickerPopperProps, ColorPickerPopperRef } from '@/components/ColorPickerPopper';
import { ColorPickerPopper } from '@/components/ColorPickerPopper';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks/canvas';

export const CanvasColorPicker: React.FC<ColorPickerPopperProps> = (props) => {
  const popperRef = React.useRef<ColorPickerPopperRef>(null);

  const updatePosition = () => popperRef.current?.update?.();

  useCanvasPan(updatePosition);
  useCanvasZoom(updatePosition);

  return <ColorPickerPopper ref={popperRef} {...props} />;
};
