import { Utils } from '@voiceflow/common';

const KEYS_CONTAINING_CREATOR_ID = new Set(['creatorID', 'updatedBy', 'updatedByCreatorID']);

export const deepSetCreatorID = <T>(struct: T, creatorID: number): T =>
  Utils.object.deepMap<T>(struct, (value, key) => (typeof key === 'string' && KEYS_CONTAINING_CREATOR_ID.has(key) ? creatorID : value));
