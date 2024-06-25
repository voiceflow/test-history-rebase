import type { IO, Point } from '@voiceflow/realtime-sdk';

import type { MovementCalculator } from '@/components/Canvas/types';
import { createDispatcherContext } from '@/contexts/DispatcherContext';
import type { Pair } from '@/types';

export interface RealtimeCursorEvents {
  zoomViewport: (calculateMovement: MovementCalculator) => void;
  panViewport: (movement: Pair<number>) => void;
}

export interface IORealtimeCursorEvents extends RealtimeCursorEvents {
  realtimeCursorMove: (data: IO.CursorMoveBroadcastData) => void;
}

export interface RealtimeCursorContextEvents extends RealtimeCursorEvents {
  [key: `realtimeCursorMove:${string}:${number}`]: (coords: Point) => void;
}

export const RealtimeCursorContext = createDispatcherContext<RealtimeCursorContextEvents>();
