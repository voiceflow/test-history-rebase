import React from 'react';

import { MarkupShapeType } from '@/constants';
import { Markup, NodeData } from '@/models';
import { MarkupLineInstance, MarkupRectangleInstance, MarkupShapeInstance } from '@/pages/Canvas/components/MarkupNode/types';
import {
  DEFAULT_MARKUP_BACKGROUND_COLOR,
  DEFAULT_MARKUP_BORDER_COLOR,
  DEFAULT_MARKUP_BORDER_RADIUS,
  DEFAULT_MARKUP_LINE_COLOR,
} from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NewShapeAPI } from '@/pages/Canvas/types';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { Point } from '@/types';
import { noop } from '@/utils/functional';
import { getRotation } from '@/utils/math';

const DEFAULT_SHAPE_DATA: Record<MarkupShapeType, any> = {
  [MarkupShapeType.RECTANGLE]: {
    borderColor: DEFAULT_MARKUP_BORDER_COLOR,
    backgroundColor: DEFAULT_MARKUP_BACKGROUND_COLOR,
    borderRadius: DEFAULT_MARKUP_BORDER_RADIUS,
    shapeType: MarkupShapeType.RECTANGLE,
  },
  [MarkupShapeType.CIRCLE]: {
    borderColor: DEFAULT_MARKUP_BORDER_COLOR,
    backgroundColor: DEFAULT_MARKUP_BACKGROUND_COLOR,
    shapeType: MarkupShapeType.CIRCLE,
  },
  [MarkupShapeType.LINE]: {
    strokeColor: DEFAULT_MARKUP_LINE_COLOR,
    shapeType: MarkupShapeType.LINE,
  },
  [MarkupShapeType.ARROW]: {
    strokeColor: DEFAULT_MARKUP_LINE_COLOR,
    shapeType: MarkupShapeType.ARROW,
  },
};

type NewShapeInstance = NewShapeAPI & {
  isVisible: boolean;
  getOrigin: () => Point | null;
  ref: React.RefObject<MarkupShapeInstance>;
};

// eslint-disable-next-line import/prefer-default-export
export const useNewShapeInstance = () => {
  const ref = React.useRef<MarkupShapeInstance>(null);
  const start = React.useRef<Point | null>(null);
  const engine = React.useContext(EngineContext)!;
  const { modeType: shapeType, finishCreating } = React.useContext(MarkupModeContext)!;
  const removeEventListeners = React.useRef(noop);
  const [isVisible, setVisible] = React.useState(false);

  const onMouseMove = React.useCallback(() => {
    const [startX, startY] = start.current!;
    const [endX, endY] = engine.getCanvasMousePosition();
    const shapeEl = ref.current;
    const isRectangle = shapeType === MarkupShapeType.RECTANGLE;
    const isCircle = shapeType === MarkupShapeType.CIRCLE;
    const isLine = shapeType === MarkupShapeType.LINE;
    const isArrow = shapeType === MarkupShapeType.ARROW;

    if (!shapeEl) return;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const width = Math.abs(deltaX);
    const height = Math.abs(deltaY);

    if (isRectangle || isCircle) {
      const originX = Math.min(startX, endX) - startX;
      const originY = Math.min(startY, endY) - startY;
      const rx = isCircle ? width : DEFAULT_MARKUP_BORDER_RADIUS;
      const ry = isCircle ? height : DEFAULT_MARKUP_BORDER_RADIUS;

      const rectEl = shapeEl as MarkupRectangleInstance;

      window.requestAnimationFrame(() => {
        rectEl.setAttribute('x', String(originX));
        rectEl.setAttribute('y', String(originY));
        rectEl.setAttribute('width', String(width));
        rectEl.setAttribute('height', String(height));
        rectEl.setAttribute('rx', String(rx));
        rectEl.setAttribute('ry', String(ry));
      });
    } else if (isLine || isArrow) {
      const lineEl = shapeEl as MarkupLineInstance;

      window.requestAnimationFrame(() => {
        lineEl.setHeadAttribute('orient', `${getRotation(deltaY, deltaX)}rad`);
        lineEl.setLineAttribute('x2', String(deltaX));
        lineEl.setLineAttribute('y2', String(deltaY));
      });
    }
  }, [shapeType]);

  const onMouseUp = React.useCallback(
    async (event) => {
      event.preventDefault();

      const [startX, startY] = start.current!;
      const [endX, endY] = engine.getCanvasMousePosition();
      const isRectangle = shapeType === MarkupShapeType.RECTANGLE;
      const isCircle = shapeType === MarkupShapeType.CIRCLE;
      const isLine = shapeType === MarkupShapeType.LINE;
      const isArrow = shapeType === MarkupShapeType.ARROW;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const width = Math.abs(deltaX);
      const height = Math.abs(deltaY);

      if (isRectangle || isCircle) {
        const data: NodeData<Markup.NodeData.Rectangle | Markup.NodeData.Circle> = {
          ...DEFAULT_SHAPE_DATA[shapeType as MarkupShapeType],
          width,
          height,
        };

        await engine.markup.addShapeNode([Math.min(startX, endX), Math.min(startY, endY)], data);
      } else if (isArrow || isLine) {
        const data: NodeData<Markup.NodeData.Line | Markup.NodeData.Arrow> = {
          ...DEFAULT_SHAPE_DATA[shapeType as MarkupShapeType],
          offsetX: deltaX,
          offsetY: deltaY,
        };

        await engine.markup.addShapeNode([startX, startY], data);
      }

      finishCreating();
    },
    [shapeType]
  );

  return React.useMemo<NewShapeInstance>(
    () => ({
      ref,
      isVisible,
      show: (origin) => {
        start.current = origin;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        setVisible(true);

        removeEventListeners.current = () => {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        };
      },
      getOrigin: () => start.current,
      hide: () => {
        start.current = null;

        removeEventListeners.current();
        setVisible(false);
      },
    }),
    [isVisible, onMouseMove, onMouseUp]
  );
};
