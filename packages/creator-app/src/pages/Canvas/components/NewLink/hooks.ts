import { Utils } from '@voiceflow/common';
import * as RealtimeSDK from '@voiceflow/realtime-sdk';
import React from 'react';
import { useDispatch } from 'react-redux';

import { FeatureFlag } from '@/config/features';
import { AutoPanningCacheContext } from '@/contexts';
import * as Account from '@/ducks/account';
import * as Realtime from '@/ducks/realtime';
import { useFeature, useRAF, useSelector, useSyncDispatch } from '@/hooks';
import { LinkedRects } from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NewLinkAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

type NewLinkInstance<T extends SVGElement> = NewLinkAPI & {
  ref: React.RefObject<T>;
  markerRef: React.RefObject<SVGMarkerElement>;
  isVisible: boolean;
  getLinkedRects: () => LinkedRects | null;
};

export const useNewLinkAPI = <T extends SVGElement>() => {
  const engine = React.useContext(EngineContext)!;
  const isAutoPanning = React.useContext(AutoPanningCacheContext);

  const creatorID = useSelector(Account.userIDSelector)!;

  const dispatch = useDispatch();
  const moveLinkV2 = useSyncDispatch(RealtimeSDK.diagram.awareness.moveLink);
  const hideLinkV2 = useSyncDispatch(RealtimeSDK.diagram.awareness.hideLink);

  const [isVisible, setVisible] = React.useState(false);

  const atomicActionsAwareness = useFeature(FeatureFlag.ATOMIC_ACTIONS_AWARENESS);

  const [redrawScheduler] = useRAF();

  const ref = React.useRef<T>(null);
  const isPinned = React.useRef(false);
  const markerRef = React.useRef<SVGMarkerElement>(null);
  const linkedRects = React.useRef<LinkedRects | null>(null);
  const removeEventListeners = React.useRef(Utils.functional.noop);

  React.useEffect(() => {
    engine.linkCreation.setElements(ref, markerRef);

    return () => {
      engine.linkCreation.setElements(null, null);
    };
  }, []);

  return React.useMemo<NewLinkInstance<T>>(() => {
    const moveLink = (points: Pair<Point>) =>
      atomicActionsAwareness.isEnabled
        ? moveLinkV2({ ...engine.context, creatorID, points })
        : dispatch(Realtime.sendRealtimeVolatileUpdate(Realtime.moveLink({ points })));

    const resetLink = () =>
      atomicActionsAwareness.isEnabled
        ? hideLinkV2({ ...engine.context, creatorID })
        : dispatch(Realtime.sendRealtimeVolatileUpdate(Realtime.moveLink({ reset: true })));

    const onMoveLink = () => {
      if (!linkedRects.current) return;

      // TODO: refactor moveLink to accept a LinkedRects like object
      moveLink([
        [linkedRects.current.sourceNodeRect.right, linkedRects.current.sourcePortRect.top + linkedRects.current.sourcePortRect.height / 2],
        [linkedRects.current.targetNodeRect.left, linkedRects.current.targetNodeRect.top],
      ]);
    };

    return {
      ref,
      markerRef,
      isVisible,

      isPinned: () => isPinned.current,

      getLinkedRects: () => linkedRects.current,

      show: (rect) => {
        const moveRect = DOMRect.fromRect(rect);

        const newLinkedRects = engine.linkCreation.getLinkedRects(moveRect, { relative: true, targetIsCanvasRect: false });

        if (!newLinkedRects) return;

        linkedRects.current = newLinkedRects;

        onMoveLink();
        setVisible(true);

        const onMouseMove = () => {
          if (isPinned.current || isAutoPanning.current || !linkedRects.current || engine.linkCreation.isCompleting) return;

          const mousePosition = engine.getCanvasMousePosition();

          [moveRect.x, moveRect.y] = mousePosition;

          linkedRects.current = engine.linkCreation.getLinkedRects(moveRect, { relative: true, targetIsCanvasRect: true });

          onMoveLink();

          redrawScheduler(() => engine.linkCreation.redrawNewLink(linkedRects.current));
        };

        const onMouseUp = (event: MouseEvent) => {
          if (event.defaultPrevented) {
            return;
          }

          if (engine.linkCreation.activeTargetPortID) {
            engine.linkCreation.complete(engine.linkCreation.activeTargetPortID);
          } else if (!engine.linkCreation.isCompleting) {
            engine.linkCreation.abort();
          }

          event.preventDefault();
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);

        removeEventListeners.current = () => {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        };
      },

      hide: () => {
        removeEventListeners.current();
        resetLink();
        setVisible(false);
      },

      pin: (rect) => {
        isPinned.current = true;

        linkedRects.current = engine.linkCreation.getLinkedRects(rect, { relative: false, targetIsCanvasRect: false });

        onMoveLink();

        redrawScheduler(() => engine.linkCreation.redrawNewLink(linkedRects.current, { isConnected: true }));
      },

      unpin: () => {
        isPinned.current = false;
      },
    };
  }, [isVisible, creatorID, atomicActionsAwareness.isEnabled, moveLinkV2]);
};
