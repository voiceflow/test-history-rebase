import _isNumber from 'lodash/isNumber';
import moize from 'moize';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { useFeature, useLinkedRef } from '@/hooks';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { Pair, Point } from '@/types';

import { InternalLinkInstance } from './types';
import { buildCenter, buildPath, getMarkerAttrs, getVirtualPoints } from './utils';

export const useLinkInstance = () => {
  const containerRef = React.useRef<SVGGElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const markerRef = React.useRef<SVGMarkerElement | null>(null);
  const engine = React.useContext(EngineContext)!;
  const hiddenPathRef = React.useRef<SVGPathElement | null>(null);
  const linkEntity = React.useContext(LinkEntityContext)!;
  const { computedPoints } = linkEntity.useState((e) => ({
    computedPoints: e.getPoints(),
  }));
  const points = useLinkedRef(computedPoints);
  const straightLines = useFeature(FeatureFlag.STRAIGHT_LINES);
  const elementInstance = useElementInstance(containerRef);

  return React.useMemo<InternalLinkInstance>(() => {
    const getMemoizedVirtualPoints = moize.simple(getVirtualPoints);

    const link = engine.getLinkByID(linkEntity.linkID);
    const targetNode = engine.getNodeByID(link.target.nodeID);
    const sourceNode = engine.getNodeByID(link.source.nodeID);
    const straightLinks = engine.isStraightLinks();
    const targetNodeIsBlock = targetNode.type === BlockType.COMBINED;

    const getSourceBlockEndY = () => {
      const nodeAPI = engine.node.api(sourceNode.parentNode || link.source.nodeID);
      const height = nodeAPI?.instance?.getRect()?.height;
      const position = nodeAPI?.instance?.getPosition() ?? null;

      if (height && position) {
        return position[1] + height / engine.canvas!.getZoom();
      }

      return null;
    };

    const drawFromPoints = (nextPoints: Pair<Point> | null) => {
      if (!nextPoints) return;

      const pathEl = pathRef.current!;
      const markerEl = markerRef.current!;
      const hiddenPathEl = hiddenPathRef.current!;

      window.requestAnimationFrame(() => {
        const nextPath = buildPath(nextPoints, {
          straight: straightLines.isEnabled && straightLinks,
          targetIsBlock: targetNodeIsBlock,
          sourceBlockEndY: getSourceBlockEndY(),
        });
        const nextMarketAttrs = getMarkerAttrs(nextPoints, { straight: straightLines.isEnabled && straightLinks, targetIsBlock: targetNodeIsBlock })!;

        pathEl.setAttribute('d', nextPath);
        hiddenPathEl.setAttribute('d', nextPath);

        Object.keys(nextMarketAttrs).forEach((attr) => markerEl.setAttribute(attr, nextMarketAttrs[attr as keyof typeof nextMarketAttrs]));

        linkEntity.portLinkInstance?.api.updatePosition(nextPoints);
      });
    };

    return {
      ...elementInstance,

      containerRef,
      pathRef,
      markerRef,
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

        drawFromPoints(getMemoizedVirtualPoints(nextPoints));
      },

      containsElement: (el) => !!containerRef.current?.contains(el),

      getPath: () =>
        buildPath(getMemoizedVirtualPoints(points.current), {
          straight: straightLines.isEnabled && straightLinks,
          targetIsBlock: targetNodeIsBlock,
          sourceBlockEndY: getSourceBlockEndY(),
        }),

      getCenter: () =>
        buildCenter(getMemoizedVirtualPoints(points.current), {
          straight: straightLines.isEnabled && straightLinks,
          targetIsBlock: targetNodeIsBlock,
          sourceBlockEndY: getSourceBlockEndY(),
        }),

      getMarkerAttrs: () =>
        getMarkerAttrs(getMemoizedVirtualPoints(points.current), {
          straight: straightLines.isEnabled && straightLinks,
          targetIsBlock: targetNodeIsBlock,
        }),
    };
  }, [elementInstance, buildPath]);
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
