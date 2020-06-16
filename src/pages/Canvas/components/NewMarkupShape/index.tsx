import cn from 'classnames';
import React from 'react';

import { BlockType, MarkupShapeType } from '@/constants';
import DraggingNode from '@/pages/Canvas/components/DraggingNode';
import { Line, RectanglePath, SvgContainer } from '@/pages/Canvas/components/MarkupShape';
import {
  DEFAULT_MARKUP_BACKGROUND_COLOR,
  DEFAULT_MARKUP_BORDER_COLOR,
  DEFAULT_MARKUP_BORDER_RADIUS,
  DEFAULT_MARKUP_LINE_COLOR,
} from '@/pages/Canvas/constants';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { ClassName } from '@/styles/constants';
import { rgbaToHex } from '@/utils/colors';

import { useNewMarkupShapeSubscription, useNewShapeInstance } from './hooks';

const BACKGROUND_COLOR = rgbaToHex(DEFAULT_MARKUP_BACKGROUND_COLOR);
const BORDER_COLOR = rgbaToHex(DEFAULT_MARKUP_BORDER_COLOR);
const LINE_COLOR = rgbaToHex(DEFAULT_MARKUP_LINE_COLOR);

const NewMarkupShape: React.FC = () => {
  const { modeType: shapeType } = React.useContext(MarkupModeContext)!;

  const api = useNewShapeInstance<SVGElement>();
  const origin = api.getOrigin();

  useNewMarkupShapeSubscription(api);

  if (!api.isVisible || !origin) return null;

  const isRectangle = shapeType === MarkupShapeType.RECTANGLE;
  const isCircle = shapeType === MarkupShapeType.CIRCLE;
  const isArrow = shapeType === MarkupShapeType.ARROW;
  const isLine = shapeType === MarkupShapeType.LINE;
  let newShape;

  if (isRectangle || isCircle) {
    newShape = (
      <RectanglePath
        width={0}
        height={0}
        isCircle={isCircle}
        backgroundColor={BACKGROUND_COLOR}
        borderColor={BORDER_COLOR}
        borderRadius={DEFAULT_MARKUP_BORDER_RADIUS}
        ref={api.ref as React.RefObject<any>}
      />
    );
  } else if (isArrow || isLine) {
    newShape = (
      <Line id="newShape" isArrow={isArrow} offsetX={0} offsetY={0} color={LINE_COLOR} ref={api.ref as React.RefObject<any>} headRef={api.headRef} />
    );
  }

  if (!newShape) return null;

  return (
    <DraggingNode className={cn(ClassName.CANVAS_NODE, `${ClassName.CANVAS_NODE}--${BlockType.MARKUP_SHAPE}`)} position={origin}>
      <SvgContainer shapeRendering="geometricPrecision">{newShape}</SvgContainer>
    </DraggingNode>
  );
};

export default React.memo(NewMarkupShape);
