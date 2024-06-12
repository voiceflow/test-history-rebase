import type { Reference, ReferenceResource } from '@voiceflow/dtos';
import { createEmpty, type Normalized } from 'normal-store';

export const STATE_KEY = 'reference';

export interface ReferenceState {
  resources: Normalized<ReferenceResource>;
  references: Normalized<Reference>;

  blockNodeResourceIDs: string[];
  triggerNodeResourceIDs: string[];
  resourceIDsByDiagramID: Partial<Record<string, string[]>>;
  refererIDsByResourceID: Partial<Record<string, string[]>>;
  resourceIDsByRefererID: Partial<Record<string, string[]>>;
}

export const INITIAL_STATE: ReferenceState = {
  resources: createEmpty(),
  references: createEmpty(),
  blockNodeResourceIDs: [],
  triggerNodeResourceIDs: [],
  resourceIDsByDiagramID: {},
  refererIDsByResourceID: {},
  resourceIDsByRefererID: {},
};
