import type { Reference, ReferenceResource } from '@voiceflow/dtos';
import { createEmpty, type Normalized } from 'normal-store';

export const STATE_KEY = 'reference';

export interface ReferenceState {
  references: Normalized<Reference>;
  referenceResources: Normalized<ReferenceResource>;

  referenceIDsByRefererID: Partial<Record<string, string[]>>; // refererID -> referenceID[]
  refererIDsByReferenceID: Partial<Record<string, string[]>>; // referenceID -> refererID[]
}

export const INITIAL_STATE: ReferenceState = {
  references: createEmpty(),
  referenceResources: createEmpty(),
  referenceIDsByRefererID: {},
  refererIDsByReferenceID: {},
};
