import React from 'react';

import { MarkupShapeType } from '@/constants';
import { Markup } from '@/models';
import { DEFAULT_MARKUP_BACKGROUND_COLOR, DEFAULT_MARKUP_BORDER_COLOR } from '@/pages/Canvas/constants';
import { PresentationModeContext } from '@/pages/Canvas/contexts';
import { rgbaToHex } from '@/utils/colors';

import { Line, RectanglePath, SvgContainer } from './components';

export * from './components';

const isRectangleOrCircle = (data: Markup.NodeData.Shape): data is Markup.NodeData.Rectangle & Markup.NodeData.Circle =>
  [MarkupShapeType.CIRCLE, MarkupShapeType.RECTANGLE].includes(data.shapeType);
const isLineOrArrow = (data: Markup.NodeData.Shape): data is Markup.NodeData.Line | Markup.NodeData.Arrow =>
  [MarkupShapeType.LINE, MarkupShapeType.ARROW].includes(data.shapeType);

export type MarkupShapeProps<T> = {
  id: string;
  data: Markup.NodeData.Shape;
  pathRef?: React.RefObject<T>;
};

const MarkupShape = <T extends SVGElement>({ id, data, pathRef }: MarkupShapeProps<T>) => {
  const isPresentationMode = React.useContext(PresentationModeContext);
  let path;

  let containerSize = {};

  if (isRectangleOrCircle(data)) {
    containerSize = {
      width: data.width,
      height: data.height,
    };

    path = (
      <RectanglePath
        ref={pathRef as React.RefObject<any>}
        width={data.width}
        height={data.height}
        borderRadius={data.borderRadius || null}
        backgroundColor={rgbaToHex(data.backgroundColor || DEFAULT_MARKUP_BACKGROUND_COLOR)}
        borderColor={rgbaToHex(data.borderColor || DEFAULT_MARKUP_BORDER_COLOR)}
        isCircle={data.shapeType === MarkupShapeType.CIRCLE}
      />
    );
  } else if (isLineOrArrow(data)) {
    containerSize = {
      width: data.offsetX,
      height: data.offsetY,
    };

    path = (
      <Line
        id={id}
        color={rgbaToHex(data.strokeColor)}
        offsetX={data.offsetX}
        offsetY={data.offsetY}
        isArrow={data.shapeType === MarkupShapeType.ARROW}
      />
    );
  }

  if (!path) return null;

  return (
    <SvgContainer {...(!isPresentationMode ? {} : containerSize)} shapeRendering="geometricPrecision" isPresentationMode={isPresentationMode}>
      {path}
    </SvgContainer>
  );
};

export default React.memo(MarkupShape);
