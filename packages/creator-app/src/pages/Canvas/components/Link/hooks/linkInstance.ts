import { ProjectLinkType } from '@voiceflow/api-sdk';
import { useCache } from '@voiceflow/ui';
import moize from 'moize';
import React from 'react';

import { BlockType } from '@/constants';
import { useLinkedRef, useRAF } from '@/hooks';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { Nullable } from '@/types';

import { STROKE_DEFAULT_COLOR } from '../constants';
import { InternalLinkInstance } from '../types';
import {
  buildPath,
  getMarkerAttrs,
  getPathPoints,
  getPathPointsCenter,
  getVirtualPoints,
  syncPointsWithSourceAndTarget,
  updateSourceSourceTargetPoints,
  updateTargetSourceTargetPoints,
} from '../utils';

const useLinkInstance = () => {
  const engine = React.useContext(EngineContext)!;
  const linkEntity = React.useContext(LinkEntityContext)!;

  const pathRef = React.useRef<SVGPathElement | null>(null);
  const markerRef = React.useRef<SVGMarkerElement | null>(null);
  const settingsRef = React.useRef<{ setPosition: () => void } | null>(null);
  const containerRef = React.useRef<SVGGElement | null>(null);
  const hiddenPathRef = React.useRef<SVGPathElement | null>(null);
  const captionRef = React.useRef<SVGForeignObjectElement | null>(null);
  const captionContainerRef = React.useRef<HTMLDivElement | null>(null);
  const buildPathMemoized = React.useMemo(() => moize.simple(buildPath), [buildPath]);

  const { linkData, sourceNodeID, targetNodeID, sourceTargetPoints } = linkEntity.useState((e) => ({
    linkData: e.resolve().data,
    sourceNodeID: e.resolve().source.nodeID,
    targetNodeID: e.resolve().target.nodeID,
    sourceTargetPoints: e.getSourceTargetPoints(),
  }));

  const isPathLocked = React.useMemo(() => !!linkData?.points?.some((point) => point.locked), [linkData?.points]);

  const [stylesScheduler] = useRAF();
  const elementInstance = useElementInstance(containerRef);

  const { straight, sourceNode, targetNodeIsBlock } = React.useMemo(() => {
    const straight = engine.isStraightLinks();
    const targetNode = engine.getNodeByID(targetNodeID);
    const sourceNode = engine.getNodeByID(sourceNodeID);
    const targetNodeIsBlock = targetNode.type === BlockType.COMBINED;

    return {
      straight: linkData?.type ? linkData.type === ProjectLinkType.STRAIGHT : straight,
      targetNode,
      sourceNode,
      targetNodeIsBlock,
    };
  }, [linkData?.type, targetNodeID, sourceNodeID]);

  const cache = useCache(
    {
      straight,
      linkData,
      mergeTarget: null as Nullable<boolean>,
      isPathLocked,
      sourceBlockEndY: null as Nullable<number>,
    },
    {
      straight,
      linkData,
      isPathLocked,
    }
  );

  const getSourceBlockEndY = React.useCallback(() => {
    const nodeAPI = engine.node.api(sourceNode.parentNode || sourceNodeID);

    if (cache.current.mergeTarget === nodeAPI?.isMergeTarget) {
      return cache.current.sourceBlockEndY;
    }

    cache.current.mergeTarget = nodeAPI?.isMergeTarget ?? null;

    const height = nodeAPI?.instance?.getRect()?.height;
    const position = nodeAPI?.instance?.getPosition() ?? null;

    if (height && position) {
      cache.current.sourceBlockEndY = position[1] + height / engine.canvas!.getZoom();
    } else {
      cache.current.sourceBlockEndY = null;
    }

    return cache.current.sourceBlockEndY;
  }, [sourceNode.parentNode, sourceNodeID]);

  const sourceTargetPointsCache = useLinkedRef(React.useMemo(() => getVirtualPoints(sourceTargetPoints), [sourceTargetPoints]));

  const points = useLinkedRef(
    React.useMemo(
      () =>
        (straight
          ? linkData?.points &&
            syncPointsWithSourceAndTarget(linkData.points, sourceTargetPointsCache.current, {
              straight: cache.current.straight,
              isPathLocked: cache.current.isPathLocked,
              targetIsBlock: targetNodeIsBlock,
              sourceBlockEndY: getSourceBlockEndY(),
            })
          : null) ||
        getPathPoints(sourceTargetPointsCache.current, {
          straight,
          connected: true,
          targetIsBlock: targetNodeIsBlock,
          sourceBlockEndY: getSourceBlockEndY(),
        }),
      [straight, linkData?.points, sourceTargetPoints]
    )
  );

  const center = useLinkedRef(
    React.useMemo(
      () => (!!linkData?.caption && points.current ? getPathPointsCenter(points.current, { straight }) : null),
      [straight, linkData?.points, !!linkData?.caption, sourceTargetPoints]
    )
  );

  const captionRect = useLinkedRef(
    React.useMemo(() => {
      const width = linkData?.caption?.width ?? captionContainerRef.current?.clientWidth ?? 150;
      const height = linkData?.caption?.height ?? captionContainerRef.current?.clientHeight ?? 20;

      return {
        x: (center.current?.[0] ?? 0) - width / 2,
        y: (center.current?.[1] ?? 0) - height / 2,
        width,
        height,
      };
    }, [straight, linkData?.points, linkData?.caption, sourceTargetPoints])
  );

  const updateCaptionPosition = React.useCallback(() => {
    if (captionRef.current) {
      captionRef.current.setAttribute('x', String(captionRect.current.x));
      captionRef.current.setAttribute('y', String(captionRect.current.y));
      captionRef.current.setAttribute('width', String(captionRect.current.width));
      captionRef.current.setAttribute('height', String(captionRect.current.height));
    }
  }, []);

  const updateMarkerPosition = React.useCallback(() => {
    const nextMarketAttrs = getMarkerAttrs(points.current, cache.current.straight)!;

    Object.keys(nextMarketAttrs).forEach((attr) => markerRef.current!.setAttribute(attr, nextMarketAttrs[attr as keyof typeof nextMarketAttrs]));
  }, []);

  React.useEffect(() => buildPathMemoized.clear, [buildPathMemoized]);

  return React.useMemo<InternalLinkInstance>(
    () => ({
      ...elementInstance,

      pathRef,
      markerRef,
      captionRef,
      settingsRef,
      containerRef,
      hiddenPathRef,
      captionContainerRef,

      updateMarkerPosition,
      updateCaptionPosition,

      getLinkType: () => cache.current.linkData?.type ?? (cache.current.straight ? ProjectLinkType.STRAIGHT : ProjectLinkType.CURVED),
      getLinkColor: () => cache.current.linkData?.color ?? STROKE_DEFAULT_COLOR,

      getCenter: () => center,
      getPoints: () => points,
      isStraight: () => cache.current.straight,
      getCaptionRect: () => captionRect,

      translatePoint: (
        moves,
        { isSource, reposition, sourceAndTargetSelected }: { isSource: boolean; reposition: boolean; sourceAndTargetSelected: boolean }
      ) => {
        if (!points.current || !sourceTargetPointsCache.current) return;

        // to do not double updated points
        if (sourceAndTargetSelected && !isSource && cache.current.straight) return;

        const pathEl = pathRef.current!;
        const hiddenPathEl = hiddenPathRef.current;

        if (reposition) {
          sourceTargetPointsCache.current = getVirtualPoints(linkEntity.getSourceTargetPoints());
        } else {
          const updateSourceTargetPoints = isSource ? updateSourceSourceTargetPoints : updateTargetSourceTargetPoints;

          sourceTargetPointsCache.current = updateSourceTargetPoints(sourceTargetPointsCache.current, moves, {
            straight: cache.current.straight,
            sourceAndTargetSelected,
          });
        }

        points.current = syncPointsWithSourceAndTarget(points.current, sourceTargetPointsCache.current, {
          straight: cache.current.straight,
          isPathLocked: cache.current.isPathLocked,
          targetIsBlock: targetNodeIsBlock,
          syncOnlySource: isSource,
          syncOnlyTarget: !isSource,
          sourceBlockEndY: getSourceBlockEndY(),
          sourceAndTargetSelected,
        });

        if (cache.current.linkData?.caption) {
          center.current = getPathPointsCenter(points.current, { straight: cache.current.straight });

          captionRect.current.x = center.current[0] - captionRect.current.width / 2;
          captionRect.current.y = center.current[1] - captionRect.current.height / 2;
        }

        const scheduler = reposition ? (callback: () => void) => callback() : stylesScheduler;

        scheduler(() => {
          const nextPath = buildPath(points.current, cache.current.straight);

          pathEl.setAttribute('d', nextPath);
          hiddenPathEl?.setAttribute('d', nextPath);

          linkEntity.portLinkInstance?.api.updatePosition(points.current);

          settingsRef.current?.setPosition();

          updateMarkerPosition();
          updateCaptionPosition();
        });
      },

      getPath: () => buildPathMemoized(points.current, cache.current.straight),

      getMarkerAttrs: () => getMarkerAttrs(points.current, cache.current.straight),
    }),
    [elementInstance, getSourceBlockEndY, buildPath]
  );
};

export default useLinkInstance;
