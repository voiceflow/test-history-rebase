import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { useCache } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import { useLinkedRef, useRAF } from '@/hooks';
import { LinkedRects } from '@/pages/Canvas/components/Link';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { PathPoints } from '@/types';
import { isRectsEqual } from '@/utils/dom';
import { isChipNode } from '@/utils/node';

import { MIN_HEIGHT, PLACEHOLDER_WIDTH } from '../components/LinkCaptionText';
import { STROKE_DEFAULT_COLOR } from '../constants';
import { InternalLinkInstance } from '../types';
import { buildPath, getMarkerAttrs, getPathPoints, getPathPointsCenter, syncPointsWithLinkedRects } from '../utils';

const useLinkRelatedRects = () => {
  const linkEntity = React.useContext(LinkEntityContext)!;

  const cacheData = React.useRef<null | { linkedRects: LinkedRects | null; sourceParentNodeRect: DOMRect | null }>(null);

  const { linkedRects, sourceParentNodeRect } = linkEntity.useState((entity) => ({
    linkedRects: entity.getLinkedRects(),
    sourceParentNodeRect: entity.getSourceParentNodeRect(),
  }));

  return React.useMemo(() => {
    const isLinkedRectsEqual = (linkedRects1: LinkedRects | null, linkedRects2: LinkedRects | null) => {
      if (linkedRects1 === null && linkedRects2 === null) return true;
      if (linkedRects1 === null || linkedRects2 === null) return false;

      return Utils.object.getKeys(linkedRects1).every((key) => isRectsEqual(linkedRects1[key], linkedRects2[key]));
    };

    if (
      !cacheData.current ||
      !isLinkedRectsEqual(cacheData.current.linkedRects, linkedRects) ||
      !isRectsEqual(cacheData.current.sourceParentNodeRect, sourceParentNodeRect)
    ) {
      cacheData.current = { linkedRects, sourceParentNodeRect };

      return [linkedRects, sourceParentNodeRect] as const;
    }

    return [cacheData.current.linkedRects, cacheData.current.sourceParentNodeRect] as const;
  }, [linkedRects, sourceParentNodeRect]);
};

const useLinkInstance = () => {
  const engine = React.useContext(EngineContext)!;
  const linkEntity = React.useContext(LinkEntityContext)!;

  const pathRef = React.useRef<SVGPathElement | null>(null);
  const markerRef = React.useRef<SVGMarkerElement | null>(null);
  const captionRef = React.useRef<SVGForeignObjectElement | null>(null);
  const settingsRef = React.useRef<{ setPosition: () => void } | null>(null);
  const containerRef = React.useRef<SVGGElement | null>(null);
  const hiddenPathRef = React.useRef<SVGPathElement | null>(null);
  const captionContainerRef = React.useRef<HTMLDivElement | null>(null);

  const { linkData, sourceNodeID, targetNodeID } = linkEntity.useState((entity) => ({
    linkData: entity.resolve().data,
    sourceNodeID: entity.resolve().source.nodeID,
    targetNodeID: entity.resolve().target.nodeID,
  }));

  const [linkedRects, sourceParentNodeRect] = useLinkRelatedRects();

  const isPathLocked = React.useMemo(() => !!linkData?.points?.some((point) => point.locked), [linkData?.points]);

  const [stylesScheduler] = useRAF();
  const elementInstance = useElementInstance(containerRef);

  const { isStraight, sourceNodeIsChip, sourceNodeIsStart, sourceNodeIsAction, targetNodeIsCombined } = React.useMemo(() => {
    const isStraight = engine.isStraightLinks();
    const targetNode = engine.getNodeByID(targetNodeID);
    const sourceNode = engine.getNodeByID(sourceNodeID);
    const sourceNodeParent = engine.getNodeByID(sourceNode?.parentNode);

    const sourceNodeIsChip = isChipNode(sourceNode, sourceNodeParent);
    const sourceNodeIsStart = sourceNode?.type === BlockType.START;
    const sourceNodeIsAction = sourceNodeParent?.type === BlockType.ACTIONS;
    const targetNodeIsCombined = targetNode?.type === BlockType.COMBINED;

    return {
      isStraight: linkData?.type ? linkData.type === BaseModels.Project.LinkType.STRAIGHT : isStraight,
      sourceNodeIsChip,
      sourceNodeIsStart,
      sourceNodeIsAction,
      targetNodeIsCombined,
    };
  }, [linkData?.type, targetNodeID, sourceNodeID]);

  const cache = useCache({
    linkData,
    isStraight,
    isPathLocked,
    sourceNodeIsChip,
    sourceNodeIsStart,
    sourceNodeIsAction,
    targetNodeIsCombined,
  });

  const prevPointsRef = React.useRef<PathPoints | null>(null);

  const points = React.useMemo(() => {
    if (engine.canvas?.isAnimating()) {
      return prevPointsRef.current;
    }

    if (!linkedRects) return null;

    if (isStraight && linkData?.points) {
      return syncPointsWithLinkedRects(linkData.points, linkedRects, {
        isStraight,
        isConnected: true,
        isPathLocked,
        syncOnlySource: false,
        syncOnlyTarget: false,
        sourceNodeIsChip,
        sourceNodeIsStart,
        sourceNodeIsAction,
        targetNodeIsCombined,
        sourceParentNodeRect,
        sourceAndTargetSelected: false,
      });
    }

    return getPathPoints(linkedRects, {
      isStraight,
      isConnected: true,
      sourceNodeIsChip,
      sourceNodeIsStart,
      sourceNodeIsAction,
      targetNodeIsCombined,
      sourceParentNodeRect,
    });
  }, [
    linkData?.points,
    isStraight,
    linkedRects,
    isPathLocked,
    sourceNodeIsChip,
    sourceNodeIsStart,
    sourceNodeIsAction,
    targetNodeIsCombined,
    sourceParentNodeRect,
  ]);

  prevPointsRef.current = points;

  const center = React.useMemo(
    () => (!!linkData?.caption && points ? getPathPointsCenter(points, { isStraight }) : null),
    [points, isStraight, !!linkData?.caption]
  );

  const pointsPath = React.useMemo(() => buildPath(points, { isStraight }), [points, isStraight]);

  const captionRect = React.useMemo(() => {
    const width = linkData?.caption?.width ?? captionContainerRef.current?.clientWidth ?? PLACEHOLDER_WIDTH;
    const height = linkData?.caption?.height ?? captionContainerRef.current?.clientHeight ?? MIN_HEIGHT;
    const centerPoints = center ?? (points ? getPathPointsCenter(points, { isStraight }) : [0, 0]);

    return {
      x: (centerPoints[0] ?? 0) - width / 2,
      y: (centerPoints[1] ?? 0) - height / 2,
      width,
      height,
    };
  }, [isStraight, points, center, linkData?.caption]);

  const pointsRef = useLinkedRef(points);
  const centerRef = useLinkedRef(center);
  const pointsPathRef = useLinkedRef(pointsPath);
  const captionRectRef = useLinkedRef(captionRect);
  const linkedRectsRef = useLinkedRef(linkedRects);

  const instance = React.useMemo<InternalLinkInstance>(() => {
    const updateCaptionPosition = () => {
      const captionElm = captionRef.current;

      if (!captionElm) return;

      captionElm.setAttribute('x', String(captionRectRef.current.x));
      captionElm.setAttribute('y', String(captionRectRef.current.y));
      captionElm.setAttribute('width', String(captionRectRef.current.width));
      captionElm.setAttribute('height', String(captionRectRef.current.height));
    };

    const updateMarkerPosition = () => {
      const markerElm = markerRef.current;

      if (!markerElm) return;

      const nextMarketAttrs = getMarkerAttrs(pointsRef.current, { isStraight: cache.current.isStraight });

      for (const attr of Utils.object.getKeys(nextMarketAttrs)) {
        markerElm.setAttribute(attr, nextMarketAttrs[attr]);
      }
    };

    const redraw = () => {
      const pathElm = pathRef.current;
      const hiddenPathElm = hiddenPathRef.current;

      if (!pathElm || !hiddenPathElm) return;

      const nextPath = buildPath(pointsRef.current, { isStraight: cache.current.isStraight });

      pointsPathRef.current = nextPath;

      pathElm.setAttribute('d', nextPath);
      hiddenPathElm?.setAttribute('d', nextPath);

      settingsRef.current?.setPosition();

      updateMarkerPosition();
      updateCaptionPosition();
    };

    const syncPoints = (
      points: PathPoints,
      linkedRects: LinkedRects,
      { isSource, sourceAndTargetSelected }: { isSource: boolean; sourceAndTargetSelected: boolean }
    ) => {
      pointsRef.current = syncPointsWithLinkedRects(points, linkedRects, {
        isStraight: cache.current.isStraight,
        isConnected: true,
        isPathLocked: cache.current.isPathLocked,
        syncOnlySource: isSource,
        syncOnlyTarget: !isSource,
        sourceNodeIsChip: cache.current.sourceNodeIsChip,
        sourceNodeIsStart: cache.current.sourceNodeIsStart,
        sourceNodeIsAction: cache.current.sourceNodeIsAction,
        sourceParentNodeRect: linkEntity.getSourceParentNodeRect(),
        targetNodeIsCombined: cache.current.targetNodeIsCombined,
        sourceAndTargetSelected,
      });

      if (cache.current.linkData?.caption) {
        centerRef.current = getPathPointsCenter(points, { isStraight: cache.current.isStraight });

        captionRectRef.current.x = centerRef.current[0] - captionRectRef.current.width / 2;
        captionRectRef.current.y = centerRef.current[1] - captionRectRef.current.height / 2;
      }
    };

    // will be called when the actions are rendered from the opposite side
    const onLinkPositionReversed = ({ isSource, sourceAndTargetSelected }: { isSource: boolean; sourceAndTargetSelected: boolean }) => {
      const linkedRects = linkEntity.getLinkedRects();

      if (!linkedRectsRef.current || !linkedRects || !pointsRef.current) return;

      linkedRectsRef.current.sourcePortRect = linkedRects.sourcePortRect;

      syncPoints(pointsRef.current, linkedRectsRef.current, { isSource, sourceAndTargetSelected });
      redraw();
    };

    return {
      ...elementInstance,

      pathRef,
      cacheRef: cache,
      markerRef,
      captionRef,
      settingsRef,
      containerRef,
      hiddenPathRef,
      linkedRectsRef,
      captionContainerRef,

      redraw,
      updateCaptionPosition,

      getLinkType: () =>
        cache.current.linkData?.type ?? (cache.current.isStraight ? BaseModels.Project.LinkType.STRAIGHT : BaseModels.Project.LinkType.CURVED),
      getLinkColor: () => cache.current.linkData?.color ?? STROKE_DEFAULT_COLOR,

      getCenter: () => centerRef,
      getPoints: () => pointsRef,
      isStraight: () => cache.current.isStraight,
      getCaptionRect: () => captionRectRef,

      onLinkPositionReversed,

      translatePoint: (moves, { sync, isSource, sourceAndTargetSelected }) => {
        if (!pointsRef.current || !linkedRectsRef.current) return;
        // to do not double updated points
        if (sourceAndTargetSelected && !isSource) return;

        if (sync) {
          linkedRectsRef.current = linkEntity.getLinkedRects();

          if (!linkedRectsRef.current) return;
        } else {
          if (isSource || sourceAndTargetSelected) {
            linkedRectsRef.current.sourceNodeRect.x += moves[0];
            linkedRectsRef.current.sourceNodeRect.y += moves[1];
            linkedRectsRef.current.sourcePortRect.x += moves[0];
            linkedRectsRef.current.sourcePortRect.y += moves[1];
          }

          if (!isSource || sourceAndTargetSelected) {
            linkedRectsRef.current.targetNodeRect.x += moves[0];
            linkedRectsRef.current.targetNodeRect.y += moves[1];
            linkedRectsRef.current.targetPortRect.x += moves[0];
            linkedRectsRef.current.targetPortRect.y += moves[1];
          }
        }

        syncPoints(pointsRef.current, linkedRectsRef.current, { isSource, sourceAndTargetSelected });

        const scheduler = sync ? (callback: () => void) => callback() : stylesScheduler;

        scheduler(() => {
          redraw();

          linkEntity.portLinkInstance?.api.updatePosition(pointsRef.current, () => onLinkPositionReversed({ isSource, sourceAndTargetSelected }));
        });
      },

      getPath: () => pointsPathRef.current,

      getMarkerAttrs: () => getMarkerAttrs(pointsRef.current, { isStraight: cache.current.isStraight }),
    };
  }, [elementInstance, buildPath]);

  React.useEffect(() => {
    linkEntity.portLinkInstance?.api.updatePosition(points, () =>
      instance.onLinkPositionReversed({ isSource: false, sourceAndTargetSelected: false })
    );
  }, [points, instance]);

  return instance;
};

export default useLinkInstance;
