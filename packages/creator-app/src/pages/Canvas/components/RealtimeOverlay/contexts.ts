import { MovementCalculator } from '@/components/Canvas/types';
import { createDispatcherContext } from '@/contexts';
import { Pair } from '@/types';

export interface RealtimeCursorEvents {
  zoomViewport: (calculateMovement: MovementCalculator) => void;
  panViewport: (movement: Pair<number>) => void;
}

export const RealtimeCursorContext = createDispatcherContext<RealtimeCursorEvents>();
