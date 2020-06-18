import cn from 'classnames';
import React from 'react';

import { BlockType, MarkupShapeType } from '@/constants';
import { MarkupLineInstance, MarkupRectangleInstance } from '@/pages/Canvas/components/MarkupNode/types';
import { Line, SvgContainer } from '@/pages/Canvas/components/MarkupShape';
import { DEFAULT_MARKUP_LINE_COLOR } from '@/pages/Canvas/constants';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { ClassName } from '@/styles/constants';
import { rgbaToHex } from '@/utils/colors';

import { Container, NewRectangle } from './components';
import { useNewMarkupShapeSubscription, useNewShapeInstance } from './hooks';

const LINE_COLOR = rgbaToHex(DEFAULT_MARKUP_LINE_COLOR);

const NewMarkupShape: React.FC = () => {
  const { modeType: shapeType } = React.useContext(MarkupModeContext)!;

  const api = useNewShapeInstance();
  const origin = api.getOrigin();

  useNewMarkupShapeSubscription(api);

  if (!api.isVisible || !origin) return null;

  const isRectangle = shapeType === MarkupShapeType.RECTANGLE;
  const isCircle = shapeType === MarkupShapeType.CIRCLE;
  const isArrow = shapeType === MarkupShapeType.ARROW;
  const isLine = shapeType === MarkupShapeType.LINE;
  let newShape;

  if (isRectangle || isCircle) {
    newShape = <NewRectangle isCircle={isCircle} ref={api.ref as React.RefObject<MarkupRectangleInstance>} />;
  } else if (isArrow || isLine) {
    newShape = (
      <Line id="newShape" isArrow={isArrow} offsetX={0} offsetY={0} color={LINE_COLOR} ref={api.ref as React.RefObject<MarkupLineInstance>} />
    );
  }

  if (!newShape) return null;

  return (
    <Container className={cn(ClassName.CANVAS_NODE, `${ClassName.CANVAS_NODE}--${BlockType.MARKUP_SHAPE}`)} position={origin}>
      <SvgContainer shapeRendering="geometricPrecision">{newShape}</SvgContainer>
    </Container>
  );
};

export default React.memo(NewMarkupShape);
