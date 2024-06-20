import type { Reference, ReferenceResource } from '@voiceflow/dtos';
import { createEmpty, type Normalized } from 'normal-store';

export const STATE_KEY = 'reference';

export interface ReferenceState {
  resources: Normalized<ReferenceResource>;
  references: Normalized<Reference>;

  // caches to optimize selectors
  blockNodeResourceIDs: string[];
  intentIDResourceIDMap: Partial<Record<string, string>>;
  triggerNodeResourceIDs: string[];
  diagramIDResourceIDMap: Partial<Record<string, string>>;
  functionIDResourceIDMap: Partial<Record<string, string>>;
  resourceIDsByDiagramIDMap: Partial<Record<string, string[]>>;
  refererIDsByResourceIDMap: Partial<Record<string, string[]>>;
  resourceIDsByRefererIDMap: Partial<Record<string, string[]>>;
  referenceIDsByResourceIDMap: Partial<Record<string, string[]>>;
  referenceIDsByReferrerIDMap: Partial<Record<string, string[]>>;
}

export const INITIAL_STATE: ReferenceState = {
  resources: createEmpty(),
  references: createEmpty(),
  blockNodeResourceIDs: [],
  intentIDResourceIDMap: {},
  triggerNodeResourceIDs: [],
  diagramIDResourceIDMap: {},
  functionIDResourceIDMap: {},
  resourceIDsByDiagramIDMap: {},
  refererIDsByResourceIDMap: {},
  resourceIDsByRefererIDMap: {},
  referenceIDsByResourceIDMap: {},
  referenceIDsByReferrerIDMap: {},
};
