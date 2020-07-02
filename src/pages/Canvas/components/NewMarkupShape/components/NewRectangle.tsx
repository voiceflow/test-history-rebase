import React from 'react';

import { MarkupRectangleInstance } from '@/pages/Canvas/components/MarkupNode/types';
import { RectanglePath } from '@/pages/Canvas/components/MarkupShape';
import { DEFAULT_MARKUP_BACKGROUND_COLOR, DEFAULT_MARKUP_BORDER_COLOR, DEFAULT_MARKUP_BORDER_RADIUS } from '@/pages/Canvas/constants';
import { rgbaToHex } from '@/utils/colors';

const BACKGROUND_COLOR = rgbaToHex(DEFAULT_MARKUP_BACKGROUND_COLOR);
const BORDER_COLOR = rgbaToHex(DEFAULT_MARKUP_BORDER_COLOR);

export type NewRectangleProps = {
  isCircle: boolean;
};

const NewRectangle: React.ForwardRefRenderFunction<MarkupRectangleInstance, NewRectangleProps> = ({ isCircle }, ref) => {
  const rectRef = React.useRef<SVGRectElement>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      setAttribute: (key, value) => rectRef.current?.setAttribute(key, value),
    }),
    []
  );

  return (
    <RectanglePath
      width={0}
      height={0}
      isCircle={isCircle}
      backgroundColor={BACKGROUND_COLOR}
      borderColor={BORDER_COLOR}
      borderRadius={DEFAULT_MARKUP_BORDER_RADIUS}
      ref={rectRef}
    />
  );
};

export default React.forwardRef(NewRectangle);
