import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';
import { Diagram } from '@/models';

export interface DiagramViewer extends Realtime.Viewer {
  color: string;
  creator_id: number;
}

export interface DiagramAwarenessState {
  viewers: Record<string, DiagramViewer[]>;
}

export interface DiagramState extends CRUDState<Diagram> {
  awareness: DiagramAwarenessState;
}
