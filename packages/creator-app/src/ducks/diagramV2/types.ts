import * as Realtime from '@voiceflow/realtime-sdk';
import { Normalized } from 'normal-store';

import { CRUDState } from '@/ducks/utils/crudV2';

interface DiagramLookup<T> {
  [diagramID: string]: T;
}

interface NodeLookup<T> {
  [nodeID: string]: T;
}

export type DiagramLocks = Partial<Record<Realtime.diagram.awareness.LockEntityType, NodeLookup<string>>>;

export interface DiagramViewer extends Realtime.Viewer {
  color: string;
  creator_id: number;
}

export interface DiagramAwarenessState {
  locks: DiagramLookup<DiagramLocks>;
  viewers: DiagramLookup<Normalized<DiagramViewer>>;
}

export interface DiagramState extends CRUDState<Realtime.Diagram> {
  awareness: DiagramAwarenessState;
  sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap;
  globalIntentStepMap: DiagramLookup<{ [intentID: string]: string[] }>;
}
