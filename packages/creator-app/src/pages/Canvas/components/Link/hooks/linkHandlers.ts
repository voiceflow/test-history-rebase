import { Models as BaseModels } from '@voiceflow/base-types';
import { swallowEvent, useCache } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { useRAF, useToggle } from '@/hooks';
import { LinkDataCaption } from '@/models';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';

import { STRAIGHT_PATH_OFFSET } from '../constants';
import { InternalLinkInstance } from '../types';
import {
  buildPath,
  clonePoint,
  getActiveLine,
  getPathPointsCenter,
  getPointsOffset,
  getPointX,
  getPointY,
  isFirstLine,
  isLastLine,
  isVerticalLine,
  transformActiveLine,
} from '../utils';

const DOUBLE_CLICK_TIMESTAMP = 300;

const useLinkHandlers = (instance: InternalLinkInstance) => {
  const engine = React.useContext(EngineContext)!;
  const linkEntity = React.useContext(LinkEntityContext)!;

  const [stylesScheduler] = useRAF();
  const [isCaptionEditing, toggleCaptionEditing] = useToggle(false);

  const { linkData } = linkEntity.useState((e) => ({ linkData: e.resolve().data }));

  const onClose = React.useCallback(() => {
    if (instance.hiddenPathRef.current) {
      instance.hiddenPathRef.current.style.cursor = 'pointer';
    }

    engine.highlight.reset();
    engine.link.redrawLinked(linkEntity.linkID);
  }, [instance]);

  const [isActive, toggleActive] = useDismissable(false, {
    ref: instance.containerRef,
    onClose,
    disableLayers: true,
    skipDefaultPrevented: false,
  });

  const cache = useCache(
    {
      instance,
      isActive,
      linkData,
      mouseDown: false,
      isDoubleClick: false,
      mouseDownTimeDiff: null as number | null,
    },
    { instance, isActive, linkData }
  );

  const updateCursor = React.useCallback(() => {
    const points = cache.current.instance.getPoints();

    if (!points.current) {
      return;
    }

    const mouseCoords = engine.canvas!.fromCoords(engine.getMouseCoords());
    const activeLine = getActiveLine(points.current, mouseCoords);

    if (!activeLine || !cache.current.instance.hiddenPathRef.current) {
      return;
    }

    const isVertical = isVerticalLine(activeLine);
    const offset = Math.abs(
      isVertical
        ? getPointsOffset(getPointY(activeLine[0]), getPointY(activeLine[1]))
        : getPointsOffset(getPointX(activeLine[0]), getPointX(activeLine[1]))
    );

    if (STRAIGHT_PATH_OFFSET >= offset && (isFirstLine(points.current, activeLine) || isLastLine(points.current, activeLine))) {
      cache.current.instance.hiddenPathRef.current.style.cursor = 'pointer';
    } else {
      cache.current.instance.hiddenPathRef.current.style.cursor = isVerticalLine(activeLine) ? 'col-resize' : 'row-resize';
    }
  }, []);

  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (isActive) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      engine.highlight.reset();
      toggleActive();
      updateCursor();
    },
    [isActive]
  );

  const onMouseEnter = React.useCallback(() => {
    if (cache.current.mouseDown || cache.current.isActive) {
      return;
    }

    engine.highlight.setLinkTarget(linkEntity.linkID);
  }, []);

  const onMouseLeave = React.useCallback((event: React.MouseEvent) => {
    if (cache.current.mouseDown || cache.current.isActive) {
      return;
    }

    if (event.relatedTarget instanceof Node && !cache.current.instance.containerRef.current?.contains(event.relatedTarget)) {
      engine.highlight.reset();
    }
  }, []);

  const onMouseDown = React.useCallback(
    swallowEvent(() => {
      const time = Date.now();

      if (cache.current.mouseDownTimeDiff !== null) {
        cache.current.isDoubleClick = time - cache.current.mouseDownTimeDiff <= DOUBLE_CLICK_TIMESTAMP;
      }

      cache.current.mouseDownTimeDiff = time;

      if (!instance.isStraight() || !cache.current.isActive) {
        return;
      }

      const points = cache.current.instance.getPoints();
      const center = cache.current.instance.getCenter();
      const captionRect = cache.current.instance.getCaptionRect();

      if (!points.current) {
        return;
      }

      const mouseCoords = engine.canvas!.fromCoords(engine.getMouseCoords());
      let activeLine = getActiveLine(points.current, mouseCoords);

      if (!activeLine) {
        return;
      }

      cache.current.mouseDown = true;

      let moved = false;

      const onBreakpointMove = () => {
        moved = true;

        const mouseCoords = engine.canvas!.fromCoords(engine.getMouseCoords());

        const pathEl = instance.pathRef.current!;
        const hiddenPathEl = instance.hiddenPathRef.current;

        if (!points.current) {
          return;
        }

        if (!activeLine) {
          activeLine = getActiveLine(points.current, mouseCoords);
        }

        if (!activeLine) {
          return;
        }

        points.current = transformActiveLine({ points: points.current, activeLine, mouseCoords });

        if (cache.current.linkData?.caption) {
          center.current = getPathPointsCenter(points.current, { straight: instance.isStraight() });
          captionRect.current.x = center.current[0] - captionRect.current.width / 2;
          captionRect.current.y = center.current[1] - captionRect.current.height / 2;
        }

        stylesScheduler(() => {
          const nextPath = buildPath(points.current, instance.isStraight());

          pathEl.setAttribute('d', nextPath);
          hiddenPathEl?.setAttribute('d', nextPath);

          instance.settingsRef.current?.setPosition();

          linkEntity.portLinkInstance?.api.updatePosition(points.current);

          instance.updateMarkerPosition();
          instance.updateCaptionPosition();
        });
      };

      document.addEventListener('mousemove', onBreakpointMove);
      document.addEventListener(
        'mouseup',
        () => {
          document.removeEventListener('mousemove', onBreakpointMove);

          cache.current.mouseDown = false;

          // implementing custom double click to fix line desync issue on double click
          if (cache.current.isDoubleClick) {
            cache.current.isDoubleClick = false;
            cache.current.mouseDownTimeDiff = null;

            toggleCaptionEditing(true);

            return;
          }

          if (moved && points.current) {
            const nextPoints = points.current.map((point) => clonePoint(point));

            points.current = nextPoints;

            engine.link.updateLinkData(linkEntity.linkID, { points: nextPoints });
          }
        },
        { once: true }
      );
    }),
    []
  );

  const onMouseMove = React.useCallback(() => {
    if (cache.current.mouseDown || !cache.current.isActive) {
      return;
    }

    if (!instance.isStraight() && cache.current.instance.hiddenPathRef.current) {
      cache.current.instance.hiddenPathRef.current.style.cursor = 'pointer';
      return;
    }

    updateCursor();
  }, []);

  const onToggleCaptionEditing = React.useCallback((value: unknown) => {
    if (cache.current.mouseDown) {
      return;
    }

    toggleCaptionEditing(value);
  }, []);

  const onRemove = React.useCallback(() => engine.link.remove(linkEntity.linkID), []);

  const onChangeType = React.useCallback(async (type: BaseModels.ProjectLinkType) => {
    await engine.link.updateLinkData(linkEntity.linkID, { type, points: null });

    engine.link.redraw(linkEntity.linkID);
  }, []);

  const onChangeCaption = React.useCallback(async (caption: LinkDataCaption | null) => {
    await engine.link.updateLinkData(linkEntity.linkID, { caption });

    engine.link.redraw(linkEntity.linkID);
  }, []);

  const onChangeColor = React.useCallback(async (color: string) => {
    await engine.link.updateLinkData(linkEntity.linkID, { color });

    engine.link.redraw(linkEntity.linkID);
  }, []);

  return {
    onClick,
    onRemove,
    isActive,
    onMouseDown,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onChangeType,
    onChangeColor,
    onChangeCaption,
    isCaptionEditing,
    onToggleCaptionEditing,
  };
};

export default useLinkHandlers;
