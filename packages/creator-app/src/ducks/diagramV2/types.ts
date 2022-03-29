import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';

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

export interface DiagramState extends CRUDState<Realtime.Diagram> {
  awareness: DiagramAwarenessState;
  intentSteps: DiagramLookup<NodeLookup<Realtime.diagram.DiagramIntentStep | null>>;
  startingBlocks: DiagramLookup<NodeLookup<Realtime.diagram.DiagramStartingBlock | null>>;
  globalIntentStepMap: DiagramLookup<{ [intentID: string]: string[] }>;
}
