import * as Realtime from '@voiceflow/realtime-sdk';
import { preventDefault, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { EventualEngineContext } from '@/contexts';
import { useLocalDispatch, useRAF } from '@/hooks';
import { cursorCoords$, useObservableEffect } from '@/store/observables';
import { composeRefs } from '@/utils/react';

import { ANIMATION_DURATION, CURSOR_EXPIRY_TIMEOUT } from '../../../constants';
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
  source$: ReturnType<typeof cursorCoords$>;
}

const RealtimeCursor = React.forwardRef<HTMLDivElement, RealtimeCursorProps>(({ source$, diagramID, creatorID, name, color: rawColor }, ref) => {
  const [stylesScheduler] = useRAF();
  const eventualEngine = React.useContext(EventualEngineContext)!;

  const state = React.useRef(CursorState.HIDDEN);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const awarenessHideCursor = useLocalDispatch(Realtime.diagram.awarenessHideCursor);
  const removeTimerRef = React.useRef<NodeJS.Timer | null>(null);
  const fadeoutTimerRef = React.useRef<NodeJS.Timer | null>(null);
  const color = React.useMemo(() => (rawColor.includes('|') ? `#${rawColor.split('|')[0]}` : '#f8758f'), [rawColor]);
  const backgroundColor = React.useMemo(() => (rawColor.includes('|') ? `#${rawColor.split('|')[1]}` : '#fddae1'), [rawColor]);

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

  useObservableEffect(
    source$,
    (coords) => {
      if (!coords) {
        clearTimers();
        hideCursor();

        return;
      }

      // using eventual engine to avoid having to re-bind this subscription when changing diagrams
      const point = eventualEngine.get()!.canvas!.reverseTransformPoint(coords, true);

      stylesScheduler(() => {
        const cursorEl = innerRef.current;

        if (!cursorEl) return;

        if (state.current !== CursorState.VISIBLE) {
          cursorEl.style.opacity = String(1);
          cursorEl.style.transition = '';
          state.current = CursorState.VISIBLE;
        }

        cursorEl.style.left = `${point[0]}px`;
        cursorEl.style.top = `${point[1]}px`;
      });

      clearTimers();
      setTimers();
    },
    [hideCursor, setTimers, clearTimers]
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
