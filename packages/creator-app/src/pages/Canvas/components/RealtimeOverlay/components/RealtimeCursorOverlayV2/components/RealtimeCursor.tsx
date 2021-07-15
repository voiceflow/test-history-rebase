import * as Realtime from '@voiceflow/realtime-sdk';
import { preventDefault, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { EventualEngineContext, RealtimeDiagramContext, RealtimeProjectContext } from '@/contexts';
import { useAtomState, useAtomSubscription, useRealtimeDispatch } from '@/hooks';
import { composeRefs } from '@/utils/react';

import { ANIMATION_DURATION, CURSOR_EXPIRY_TIMEOUT } from '../../../constants';
import Cursor from '../../RealtimeOverlayCursor';
import Nametag from '../../RealtimeOverlayNametag';

export type RealtimeCursorProps = {
  diagramID: string;
  tabID: string;
};

const RealtimeCursor = React.forwardRef<HTMLDivElement, RealtimeCursorProps>(({ diagramID, tabID }, ref) => {
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const { cursorCoordsAtom } = React.useContext(RealtimeDiagramContext)!;
  const { viewerAtom } = React.useContext(RealtimeProjectContext)!;
  const viewer = useAtomState(viewerAtom({ tabID }));
  const innerRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useRealtimeDispatch();
  const removeTimerRef = React.useRef<NodeJS.Timer | null>(null);
  const fadeoutTimerRef = React.useRef<NodeJS.Timer | null>(null);

  const color = React.useMemo(() => (viewer.color.includes('|') ? `#${viewer.color.split('|')[0]}` : '#f8758f'), [viewer.color]);
  const backgroundColor = React.useMemo(() => (viewer.color.includes('|') ? `#${viewer.color.split('|')[1]}` : '#fddae1'), [viewer.color]);

  const setTimers = React.useCallback(() => {
    removeTimerRef.current = setTimeout(() => dispatch.local(Realtime.diagram.hideCursor({ diagramID, tabID })), CURSOR_EXPIRY_TIMEOUT);

    fadeoutTimerRef.current = setTimeout(() => {
      window.requestAnimationFrame(() => {
        const el = innerRef.current;
        if (!el) return;

        el.style.opacity = String(0);
      });
    }, CURSOR_EXPIRY_TIMEOUT - ANIMATION_DURATION);
  }, [diagramID, tabID]);

  const clearTimers = React.useCallback(() => {
    if (removeTimerRef.current !== null) {
      clearTimeout(removeTimerRef.current);
      removeTimerRef.current = null;
    }
    if (fadeoutTimerRef.current !== null) {
      clearTimeout(fadeoutTimerRef.current);
      fadeoutTimerRef.current = null;
    }
  }, []);

  const [initialX, initialY] = useAtomSubscription(cursorCoordsAtom({ tabID }), (coords) => {
    // using eventual engine to avoid having to re-bind this subscription when changing diagrams
    const point = eventualEngine.get()!.canvas!.reverseTransformPoint(coords, true);

    window.requestAnimationFrame(() => {
      const cursorEl = innerRef.current;

      if (!cursorEl) return;

      cursorEl.style.opacity = String(1);
      cursorEl.style.left = `${point[0]}px`;
      cursorEl.style.top = `${point[1]}px`;
    });

    clearTimers();
    setTimers();
  });

  React.useEffect(() => {
    setTimers();

    return () => {
      clearTimers();
    };
  }, []);

  return (
    <Cursor style={{ left: `${initialX}px`, top: `${initialY}px` }} onClick={preventDefault()} ref={composeRefs(innerRef, ref)}>
      <SvgIcon icon="cursor" color={color} />
      <div style={{ position: 'relative' }}>
        <Nametag color={color} backgroundColor={backgroundColor}>
          {viewer.name}
        </Nametag>
      </div>
    </Cursor>
  );
});

export default React.memo(RealtimeCursor);
