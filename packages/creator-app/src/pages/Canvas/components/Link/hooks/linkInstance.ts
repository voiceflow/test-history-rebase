import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { useCache } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import { useLinkedRef, useRAF } from '@/hooks';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';

import { MIN_HEIGHT, PLACEHOLDER_WIDTH } from '../components/LinkCaptionText';
import { STROKE_DEFAULT_COLOR } from '../constants';
import { InternalLinkInstance } from '../types';
import { buildPath, getMarkerAttrs, getPathPointsCenter, getPathPointsV2, syncPointsWithLinkedRects } from '../utils';

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

  const { linkData, sourceNodeID, targetNodeID, linkedRects, sourceParentNodeRect } = linkEntity.useState((entity) => ({
    linkData: entity.resolve().data,
    linkedRects: entity.getLinkedRects(),
    sourceNodeID: entity.resolve().source.nodeID,
    targetNodeID: entity.resolve().target.nodeID,
    sourceParentNodeRect: entity.getSourceParentNodeRect(),
  }));

  const isPathLocked = React.useMemo(() => !!linkData?.points?.some((point) => point.locked), [linkData?.points]);

  const [stylesScheduler] = useRAF();
  const elementInstance = useElementInstance(containerRef);

  const { isStraight, sourceNodeIsStart, sourceNodeIsAction, targetNodeIsCombined } = React.useMemo(() => {
    const isStraight = engine.isStraightLinks();
    const targetNode = engine.getNodeByID(targetNodeID);
    const sourceNode = engine.getNodeByID(sourceNodeID);
    // TODO: replace with the BlockType.ACTIONS
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const sourceNodeIsAction = sourceNode?.type === 'actions';
    const sourceNodeIsStart = sourceNode?.type === BlockType.START;
    const targetNodeIsCombined = targetNode?.type === BlockType.COMBINED;

    return {
      isStraight: linkData?.type ? linkData.type === BaseModels.Project.LinkType.STRAIGHT : isStraight,
      sourceNodeIsStart,
      sourceNodeIsAction,
      targetNodeIsCombined,
    };
  }, [linkData?.type, targetNodeID, sourceNodeID]);

  const cache = useCache({
    linkData,
    isStraight,
    isPathLocked,
    sourceNodeIsStart,
    sourceNodeIsAction,
    targetNodeIsCombined,
  });

  const points = React.useMemo(() => {
    if (!linkedRects) return null;

    if (isStraight && linkData?.points) {
      return syncPointsWithLinkedRects(linkData.points, linkedRects, {
        isStraight,
        isConnected: true,
        isPathLocked,
        syncOnlySource: false,
        syncOnlyTarget: false,
        sourceNodeIsStart,
        sourceNodeIsAction,
        targetNodeIsCombined,
        sourceParentNodeRect,
        sourceAndTargetSelected: false,
      });
    }

    return getPathPointsV2(linkedRects, {
      isStraight,
      isConnected: true,
      sourceNodeIsStart,
      sourceNodeIsAction,
      targetNodeIsCombined,
      sourceParentNodeRect,
    });
  }, [isStraight, linkData?.points, isPathLocked, linkedRects, sourceNodeIsStart, sourceNodeIsAction, targetNodeIsCombined, sourceParentNodeRect]);

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

  const updateCaptionPosition = React.useCallback(() => {
    const captionElm = captionRef.current;

    if (!captionElm) return;

    captionElm.setAttribute('x', String(captionRectRef.current.x));
    captionElm.setAttribute('y', String(captionRectRef.current.y));
    captionElm.setAttribute('width', String(captionRectRef.current.width));
    captionElm.setAttribute('height', String(captionRectRef.current.height));
  }, []);

  const updateMarkerPosition = React.useCallback(() => {
    const markerElm = markerRef.current;

    if (!markerElm) return;

    const nextMarketAttrs = getMarkerAttrs(pointsRef.current, { isStraight: cache.current.isStraight });

    // eslint-disable-next-line no-restricted-syntax
    for (const attr of Utils.object.getKeys(nextMarketAttrs)) {
      markerElm.setAttribute(attr, nextMarketAttrs[attr]);
    }
  }, []);

  React.useEffect(() => {
    linkEntity.portLinkInstance?.api.updatePosition(points);
  }, [points]);

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

      getLinkType: () =>
        cache.current.linkData?.type ?? (cache.current.isStraight ? BaseModels.Project.LinkType.STRAIGHT : BaseModels.Project.LinkType.CURVED),
      getLinkColor: () => cache.current.linkData?.color ?? STROKE_DEFAULT_COLOR,

      getCenter: () => centerRef,
      getPoints: () => pointsRef,
      isStraight: () => cache.current.isStraight,
      getCaptionRect: () => captionRectRef,

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

        pointsRef.current = syncPointsWithLinkedRects(pointsRef.current, linkedRectsRef.current, {
          isStraight: cache.current.isStraight,
          isConnected: true,
          isPathLocked: cache.current.isPathLocked,
          syncOnlySource: isSource,
          syncOnlyTarget: !isSource,
          sourceNodeIsStart: cache.current.sourceNodeIsStart,
          sourceNodeIsAction: cache.current.sourceNodeIsAction,
          sourceParentNodeRect: linkEntity.getSourceParentNodeRect(),
          targetNodeIsCombined: cache.current.targetNodeIsCombined,
          sourceAndTargetSelected,
        });

        if (cache.current.linkData?.caption) {
          centerRef.current = getPathPointsCenter(pointsRef.current, { isStraight: cache.current.isStraight });

          captionRectRef.current.x = centerRef.current[0] - captionRectRef.current.width / 2;
          captionRectRef.current.y = centerRef.current[1] - captionRectRef.current.height / 2;
        }

        const scheduler = sync ? (callback: () => void) => callback() : stylesScheduler;

        scheduler(() => {
          const pathElm = pathRef.current;
          const hiddenPathElm = hiddenPathRef.current;

          if (!pathElm || !hiddenPathElm) return;

          const nextPath = buildPath(pointsRef.current, { isStraight: cache.current.isStraight });

          pointsPathRef.current = nextPath;

          pathElm.setAttribute('d', nextPath);
          hiddenPathElm?.setAttribute('d', nextPath);

          linkEntity.portLinkInstance?.api.updatePosition(pointsRef.current);

          settingsRef.current?.setPosition();

          updateMarkerPosition();
          updateCaptionPosition();
        });
      },

      getPath: () => pointsPathRef.current,

      getMarkerAttrs: () => getMarkerAttrs(pointsRef.current, { isStraight: cache.current.isStraight }),
    }),
    [elementInstance, buildPath]
  );
};

export default useLinkInstance;
