import composeRefs from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { preventDefault, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { EventualEngineContext } from '@/contexts';
import { useLocalDispatch, useRAF } from '@/hooks';

import { ANIMATION_DURATION, CURSOR_EXPIRY_TIMEOUT } from '../../../constants';
import { RealtimeCursorContext } from '../../../contexts';
import Cursor from '../../RealtimeOverlayCursor';
import Nametag from '../../RealtimeOverlayNametag';

enum CursorState {
  VISIBLE = 'visible',
  FADING = 'fading',
  HIDDEN = 'hidden',
}

export interface RealtimeCursorProps {
  diagramID: string;
  creatorID: number;
  name: string;
  color: string;
}

const RealtimeCursor = React.forwardRef<HTMLDivElement, RealtimeCursorProps>(({ diagramID, creatorID, name, color: rawColor }, ref) => {
  const [stylesScheduler] = useRAF();
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const cursorContext = React.useContext(RealtimeCursorContext.Context)!;

  const state = React.useRef(CursorState.HIDDEN);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const awarenessHideCursor = useLocalDispatch(Realtime.diagram.awareness.hideCursor);
  const removeTimerRef = React.useRef<NodeJS.Timer | null>(null);
  const fadeoutTimerRef = React.useRef<NodeJS.Timer | null>(null);
  const color = React.useMemo(() => (rawColor.includes('|') ? `#${rawColor.split('|')[0]}` : '#f8758f'), [rawColor]);
  const backgroundColor = React.useMemo(() => (rawColor.includes('|') ? `#${rawColor.split('|')[1]}` : '#fddae1'), [rawColor]);
  const prevCoords = React.useRef<Realtime.Point | null>(null);

  const hideCursor = React.useCallback(() => {
    state.current = CursorState.HIDDEN;

    stylesScheduler(() => {
      const el = innerRef.current;
      if (!el) return;

      el.style.transition = `opacity ${CURSOR_EXPIRY_TIMEOUT / 2000}s ease`;
      el.style.opacity = String(0);
    });
  }, []);

  const setTimers = React.useCallback(() => {
    removeTimerRef.current = setTimeout(() => awarenessHideCursor({ ...eventualEngine.get()!.context, creatorID }), CURSOR_EXPIRY_TIMEOUT);

    fadeoutTimerRef.current = setTimeout(hideCursor, CURSOR_EXPIRY_TIMEOUT - ANIMATION_DURATION);
  }, [hideCursor, diagramID, creatorID]);

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

  const translateCursor = React.useCallback((translate: (point: Realtime.Point) => Realtime.Point) => {
    const point = prevCoords.current;
    if (!point) return;

    const nextPoint: Realtime.Point = translate(point);
    prevCoords.current = nextPoint;

    stylesScheduler(() => {
      const cursorEl = innerRef.current;
      if (!cursorEl) return;

      cursorEl.style.setProperty('transform', `translate(${nextPoint[0]}px, ${nextPoint[1]}px)`);
    });
  }, []);

  cursorContext.useSubscription(`realtimeCursorMove:${diagramID}:${creatorID}`, (coords) => {
    if (!coords) {
      clearTimers();
      hideCursor();
      return;
    }

    // using eventual engine to avoid having to re-bind this subscription when changing diagrams
    const point = eventualEngine.get()!.canvas!.reverseTransformPoint(coords, true);
    prevCoords.current = point;

    stylesScheduler(() => {
      const cursorEl = innerRef.current;

      if (!cursorEl) return;

      if (state.current !== CursorState.VISIBLE) {
        cursorEl.style.opacity = String(1);
        cursorEl.style.transition = 'transform 50ms ease';
        state.current = CursorState.VISIBLE;
      }

      cursorEl.style.setProperty('transform', `translate(${point[0]}px, ${point[1]}px)`);
    });

    clearTimers();
    setTimers();
  });
  cursorContext.useSubscription('panViewport', ([moveX, moveY]) => translateCursor(([x, y]) => [x + moveX, y + moveY]), [translateCursor]);
  cursorContext.useSubscription(
    'zoomViewport',
    (calculateMovement) =>
      translateCursor((point) => {
        const [moveX, moveY] = calculateMovement(point);

        return [point[0] + moveX, point[1] + moveY];
      }),
    [translateCursor]
  );

  React.useEffect(() => {
    setTimers();

    return () => {
      clearTimers();
    };
  }, [setTimers, clearTimers]);

  return (
    <Cursor withTransition={false} ref={composeRefs(innerRef, ref)} style={{ left: 0, top: 0, opacity: 0 }} onClick={preventDefault()}>
      <SvgIcon icon="cursor" color={color} />
      <div style={{ position: 'relative' }}>
        <Nametag color={color} backgroundColor={backgroundColor}>
          {name}
        </Nametag>
      </div>
    </Cursor>
  );
});

export default React.memo(RealtimeCursor);
