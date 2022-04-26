import React from 'react';

import { EventualEngineContext } from '@/contexts';
import { useRAF } from '@/hooks';
import { buildHeadMarker, buildPath, getPathPoints, HeadMarker, Path } from '@/pages/Canvas/components/Link';
import { linkPoints$, useObservableEffect } from '@/store/observables';
import { Pair, Point } from '@/types';

import LinkOverlaySvg from '../../RealtimeOverlayLinkPathSvg';

enum CursorState {
  VISIBLE = 'visible',
  FADING = 'fading',
  HIDDEN = 'hidden',
}

export interface RealtimeLinkProps {
  color: string;
  source$: ReturnType<typeof linkPoints$>;
  creatorID: number;
}

const RealtimeLink: React.FC<RealtimeLinkProps> = ({ color: rawColor, source$, creatorID }) => {
  const [stylesScheduler] = useRAF();
  const eventualEngine = React.useContext(EventualEngineContext)!;

  const state = React.useRef(CursorState.HIDDEN);
  const color = React.useMemo(() => (rawColor.includes('|') ? `#${rawColor.split('|')[0]}` : '#f8758f'), [rawColor]);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);

  const hideCursor = React.useCallback(() => {
    state.current = CursorState.HIDDEN;

    stylesScheduler(() => {
      const el = pathRef.current;
      if (!el) return;

      el.style.opacity = String(0);
    });
  }, []);

  useObservableEffect(
    source$,
    (points) => {
      const engine = eventualEngine.get();

      if (!points || !engine?.canvas) {
        hideCursor();

        return;
      }

      const [startPoint, endPoint] = points;

      // using eventual engine to avoid having to re-bind this subscription when changing diagrams
      const nextPoint: Pair<Point> = [engine.canvas.reverseTransformPoint(startPoint, true), engine.canvas.reverseTransformPoint(endPoint, true)];

      stylesScheduler(() => {
        const pathEl = pathRef.current;

        if (!pathEl) return;

        const isStraight = engine.isStraightLinks();

        const path = buildPath(getPathPoints(nextPoint, { straight: isStraight }), { isStraight });

        if (state.current !== CursorState.VISIBLE) {
          pathEl.style.opacity = String(1);
          state.current = CursorState.VISIBLE;
        }

        pathEl.setAttribute('d', path);
      });
    },
    [hideCursor]
  );

  return (
    <LinkOverlaySvg ref={svgRef}>
      <defs>
        <HeadMarker id={String(creatorID)} color={color} />
      </defs>

      <Path ref={pathRef} strokeColor={color} markerEnd={buildHeadMarker(String(creatorID))} />
    </LinkOverlaySvg>
  );
};

export default React.memo(RealtimeLink);
