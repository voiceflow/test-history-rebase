import moize from 'moize';
import React from 'react';

import { useLinkedRef } from '@/hooks';
import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { Pair, Point } from '@/types';

import { InternalLinkInstance } from './types';
import { buildCenter, buildPath } from './utils';

export const useLinkInstance = () => {
  const containerRef = React.useRef<SVGGElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const hiddenPathRef = React.useRef<SVGPathElement | null>(null);
  const linkEntity = React.useContext(LinkEntityContext)!;
  const { computedPoints } = linkEntity.useState((e) => ({
    computedPoints: e.getPoints(),
  }));
  const points = useLinkedRef(computedPoints);

  const elementInstance = useElementInstance(containerRef);

  return React.useMemo<InternalLinkInstance>(() => {
    const getVirtualPoints = moize.simple((rawPoints: Pair<Point> | null): Pair<Point> | null => {
      if (!rawPoints) {
        return rawPoints!;
      }

      const [[x1, y1], [x2, y2]] = rawPoints;

      return [
        [x1 + LINK_WIDTH, y1],
        [x2, y2],
      ];
    });

    const drawFromPoints = (nextPoints: Pair<Point>) => {
      const pathEl = pathRef.current!;
      const hiddenPathEl = hiddenPathRef.current!;

      window.requestAnimationFrame(() => {
        const nextPath = buildPath(nextPoints);

        pathEl.setAttribute('d', nextPath);
        hiddenPathEl.setAttribute('d', nextPath);
      });
    };

    return {
      ...elementInstance,

      containerRef,
      pathRef,
      hiddenPathRef,

      translatePoint: ([moveX, moveY], isSource) => {
        const [[startX, startY], [endX, endY]] = points.current!;

        const nextPoints: Pair<Point> = isSource
          ? [
              [startX + moveX, startY + moveY],
              [endX, endY],
            ]
          : [
              [startX, startY],
              [endX + moveX, endY + moveY],
            ];

        points.current = nextPoints;

        drawFromPoints(getVirtualPoints(nextPoints)!);
      },

      containsElement: (el) => !!containerRef.current?.contains(el),

      getPath: () => buildPath(getVirtualPoints(points.current)!),

      getCenter: () => buildCenter(getVirtualPoints(points.current)!),
    };
  }, [elementInstance]);
};

export const useLinkHandlers = () => {
  const engine = React.useContext(EngineContext)!;
  const linkEntity = React.useContext(LinkEntityContext)!;

  const onMouseEnter = React.useCallback(() => engine.highlight.setLinkTarget(linkEntity.linkID), []);

  const onMouseLeave = React.useCallback((event: React.MouseEvent) => {
    if (event.relatedTarget instanceof Node && !linkEntity.instance!.containsElement(event.relatedTarget)) {
      engine.highlight.reset();
    }
  }, []);

  const onRemove = React.useCallback(() => engine.link.remove(linkEntity.linkID), []);

  return {
    onMouseEnter,
    onMouseLeave,
    onRemove,
  };
};
