import { Point } from '@/types';
import { Normalized } from '@/utils/normalized';

export interface RealtimeDiagramState {
  [diagramID: string]: {
    awareness: RealtimeDiagramAwarenessState;
  };
}

export type RealtimeDiagramAwarenessState = Normalized<Point>;
