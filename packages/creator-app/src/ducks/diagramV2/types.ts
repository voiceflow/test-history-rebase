import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';
import { Diagram } from '@/models';

interface DiagramLookup<T> {
  [diagramID: string]: T;
}

interface NodeLookup<T> {
  [nodeID: string]: T;
}

export interface DiagramViewer extends Realtime.Viewer {
  color: string;
  creator_id: number;
}

export interface DiagramAwarenessState {
  viewers: DiagramLookup<DiagramViewer[]>;
}

export interface DiagramState extends CRUDState<Diagram> {
  awareness: DiagramAwarenessState;
  intentSteps: DiagramLookup<NodeLookup<string | null>>;
}
