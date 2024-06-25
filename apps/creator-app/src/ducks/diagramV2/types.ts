import type * as Realtime from '@voiceflow/realtime-sdk';

import type { CRUDState } from '@/ducks/utils/crudV2';

interface DiagramLookup<T> {
  [diagramID: string]: T;
}

interface NodeLookup<T> {
  [nodeID: string]: T;
}

export type DiagramLocks = Partial<Record<Realtime.diagram.awareness.LockEntityType, NodeLookup<string>>>;

export interface DiagramAwarenessState {
  locks: DiagramLookup<DiagramLocks>;
}

export interface DiagramState extends CRUDState<Realtime.Diagram> {
  awareness: DiagramAwarenessState;
  /**
   * @deprecated remove with REFERENCE_SYSTEM ff removal
   */
  sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap;
  /**
   * @deprecated remove with REFERENCE_SYSTEM ff removal
   */
  lastCreatedID: string | null;
  /**
   * @deprecated remove with REFERENCE_SYSTEM ff removal
   */
  globalIntentStepMap: DiagramLookup<{ [intentID: string]: string[] }>;
}
