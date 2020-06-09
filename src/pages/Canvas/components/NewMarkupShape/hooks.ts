import React from 'react';

import { MarkupShapeType } from '@/constants';
import { useTeardown } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { DEFAULT_MARKUP_BORDER_RADIUS, DEFAULT_MARKUP_LINE_COLOR } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NewShapeAPI } from '@/pages/Canvas/types';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { Point } from '@/types';
import { noop } from '@/utils/functional';
import { getRotation } from '@/utils/math';

const DEFAULT_SHAPE_DATA: Record<MarkupShapeType, any> = {
  [MarkupShapeType.RECTANGLE]: {
    borderColor: null,
    backgroundColor: null,
    borderRadius: DEFAULT_MARKUP_BORDER_RADIUS,
    shapeType: MarkupShapeType.RECTANGLE,
  },
  [MarkupShapeType.CIRCLE]: {
    borderColor: null,
    backgroundColor: null,
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

type NewShapeInstance<T extends SVGElement> = NewShapeAPI & {
  isVisible: boolean;
  getOrigin: () => Point | null;
  ref: React.RefObject<T>;
  headRef: React.RefObject<SVGMarkerElement>;
};

export const useNewShapeInstance = <T extends SVGElement>() => {
  const ref = React.useRef<T>(null);
  const headRef = React.useRef<SVGMarkerElement>(null);
  const start = React.useRef<Point | null>(null);
  const engine = React.useContext(EngineContext)!;
  const { modeType: shapeType, finishCreating } = React.useContext(MarkupModeContext)!;
  const removeEventListeners = React.useRef(noop);
  const [isVisible, setVisible] = React.useState(false);

  const onMouseMove = React.useCallback(() => {
    const [startX, startY] = start.current!;
    const [endX, endY] = engine.getCanvasMousePosition();
    const pathEl = ref.current!;
    const isRectangle = shapeType === MarkupShapeType.RECTANGLE;
    const isCircle = shapeType === MarkupShapeType.CIRCLE;
    const isLine = shapeType === MarkupShapeType.LINE;
    const isArrow = shapeType === MarkupShapeType.ARROW;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const width = Math.abs(deltaX);
    const height = Math.abs(deltaY);

    if (isRectangle || isCircle) {
      const originX = Math.min(startX, endX) - startX;
      const originY = Math.min(startY, endY) - startY;
      const rx = isCircle ? width : DEFAULT_MARKUP_BORDER_RADIUS;
      const ry = isCircle ? height : DEFAULT_MARKUP_BORDER_RADIUS;

      window.requestAnimationFrame(() => {
        pathEl.setAttribute('x', String(originX));
        pathEl.setAttribute('y', String(originY));
        pathEl.setAttribute('width', String(width));
        pathEl.setAttribute('height', String(height));
        pathEl.setAttribute('rx', String(rx));
        pathEl.setAttribute('ry', String(ry));
      });
    } else if (isLine || isArrow) {
      const headEl = headRef.current;

      window.requestAnimationFrame(() => {
        headEl?.setAttribute('orient', `${getRotation(deltaY, deltaX)}rad`);
        pathEl.setAttribute('x2', String(deltaX));
        pathEl.setAttribute('y2', String(deltaY));
      });
    }
  }, [shapeType]);

  const onMouseUp = React.useCallback(
    (event) => {
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

        engine.markup.addShapeNode([Math.min(startX, endX), Math.min(startY, endY)], data);
      } else if (isArrow || isLine) {
        const data: NodeData<Markup.NodeData.Line | Markup.NodeData.Arrow> = {
          ...DEFAULT_SHAPE_DATA[shapeType as MarkupShapeType],
          offsetX: deltaX,
          offsetY: deltaY,
        };

        engine.markup.addShapeNode([startX, startY], data);
      }

      finishCreating();
    },
    [shapeType]
  );

  return React.useMemo<NewShapeInstance<T>>(
    () => ({
      ref,
      headRef,
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

export const useNewMarkupShapeSubscription = (api: NewShapeAPI) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => engine.markup.registerNewShape(api), [api]);

  useTeardown(() => {
    engine.markup.registerNewShape(null);
    api.hide();
  });
};
