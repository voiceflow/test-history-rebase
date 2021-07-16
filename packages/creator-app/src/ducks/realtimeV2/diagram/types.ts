import { Viewer } from '@voiceflow/realtime-sdk';

import { Point } from '@/types';

export interface RealtimeDiagramAwarenessState {
  cursors: Record<string, Record<string, Point>>;
  viewers: Record<string, (Viewer & { color: string; creator_id: number })[]>;
}

export interface RealtimeDiagramState {
  awareness: RealtimeDiagramAwarenessState;
}
