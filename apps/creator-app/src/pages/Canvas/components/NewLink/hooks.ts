import { Utils } from '@voiceflow/common';
import React from 'react';

import * as Account from '@/ducks/account';
import { useRAF, useSelector } from '@/hooks';
import { LinkedRects } from '@/pages/Canvas/components/Link';
import { EngineContext, LinkStepMenuContext } from '@/pages/Canvas/contexts';
import { NewLinkAPI } from '@/pages/Canvas/types';
import { AutoPanningCacheContext } from '@/pages/Project/contexts/AutoPanningContext';

type NewLinkInstance<T extends SVGElement> = NewLinkAPI & {
  ref: React.RefObject<T>;
  markerRef: React.RefObject<SVGMarkerElement>;
  isVisible: boolean;
  getLinkedRects: () => LinkedRects | null;
};

export const useNewLinkAPI = <T extends SVGElement>() => {
  const engine = React.useContext(EngineContext)!;
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const stepMenu = React.useContext(LinkStepMenuContext)!;

  const creatorID = useSelector(Account.userIDSelector)!;

  const [isVisible, setVisible] = React.useState(false);

  const [redrawScheduler] = useRAF();

  const ref = React.useRef<T>(null);
  const isPinned = React.useRef(false);
  const markerRef = React.useRef<SVGMarkerElement>(null);
  const linkedRects = React.useRef<LinkedRects | null>(null);
  const removeEventListeners = React.useRef(Utils.functional.noop);

  const showStepMenu = React.useCallback((event: MouseEvent) => stepMenu.onOpen(event), []);
  const hideStepMenu = React.useCallback(() => stepMenu.onHide(), []);

  React.useEffect(() => {
    engine.linkCreation.setElements(ref, markerRef);

    return () => {
      engine.linkCreation.setElements(null, null);
    };
  }, []);

  return React.useMemo<NewLinkInstance<T>>(() => {
    return {
      ref,
      markerRef,
      isVisible,

      isPinned: () => isPinned.current,

      getLinkedRects: () => linkedRects.current,

      show: (rect) => {
        const moveRect = DOMRect.fromRect(rect);

        const newLinkedRects = engine.linkCreation.getLinkedRects(moveRect, {
          relative: true,
          targetIsCanvasRect: false,
        });

        if (!newLinkedRects) return;

        linkedRects.current = newLinkedRects;

        setVisible(true);

        const onMouseMove = () => {
          if (
            isPinned.current ||
            isAutoPanning.current ||
            engine.linkCreation.isCompleting ||
            engine.linkCreation.blockViaLinkMenuOpened
          )
            return;

          const mousePosition = engine.getCanvasMousePosition();

          [moveRect.x, moveRect.y] = mousePosition;

          linkedRects.current = engine.linkCreation.getLinkedRects(moveRect, {
            relative: true,
            targetIsCanvasRect: true,
          });

          redrawScheduler(() => {
            engine.linkCreation.redrawNewLink(linkedRects.current);
          });
        };

        const onMouseUp = (event: MouseEvent) => {
          if (event.defaultPrevented || engine.linkCreation.blockViaLinkMenuOpened) {
            return;
          }

          if (engine.linkCreation.activeTargetPortID) {
            engine.linkCreation.complete(engine.linkCreation.activeTargetPortID);
          } else if (
            engine.linkCreation.blockViaLinkMode &&
            !engine.linkCreation.blockViaLinkMenuOpened &&
            event.button !== 2
          ) {
            showStepMenu(event);
          } else if (!engine.linkCreation.isCompleting && !engine.linkCreation.blockViaLinkMenuOpened) {
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
        setVisible(false);
      },

      pin: (rect) => {
        isPinned.current = true;

        linkedRects.current = engine.linkCreation.getLinkedRects(rect, { relative: false, targetIsCanvasRect: false });

        redrawScheduler(() => engine.linkCreation.redrawNewLink(linkedRects.current, { isConnected: true }));
      },

      unpin: () => {
        isPinned.current = false;
      },

      hideMenu: () => hideStepMenu(),
    };
  }, [isVisible, creatorID]);
};
