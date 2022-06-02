import { Nullable } from '@voiceflow/common';
import { PopperAPI, VirtualElement } from '@voiceflow/ui';
import React from 'react';

import { ColorPickerPopper, ColorPickerPopperProps } from '@/components/ColorPickerPopper';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';

export const CanvasColorPicker: React.FC<ColorPickerPopperProps> = (props) => {
  const popperRef = React.useRef<PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>>>(null);

  const updatePosition = () => popperRef.current?.update?.();

  useCanvasPan(updatePosition);
  useCanvasZoom(updatePosition);

  return <ColorPickerPopper ref={popperRef} {...props} />;
};
