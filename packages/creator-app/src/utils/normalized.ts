import { Utils } from '@voiceflow/realtime-sdk';

export type { Normalized, NormalizedValue } from '@voiceflow/realtime-sdk';

export const {
  createEmptyNormalized,
  EMPTY,
  defaultGetKey,
  safeAdd,
  safeAddToStart,
  getByIndex,
  getByKey,
  buildLookup,
  normalize,
  denormalize,
  getNormalizedByKey,
  getAllNormalizedByKeys,
  updateNormalizedByKey,
  patchNormalizedByKey,
  addNormalizedByKey,
  addToStartNormalizedByKey,
  addAllNormalizedByKeys,
  removeNormalizedByKey,
  reorderKeys,
  removeAllNormalizedByKeys,
} = Utils.normalized;

export type ObjectWithId = Utils.normalized.ObjectWithId;
export type GetKey<T> = Utils.normalized.GetKey<T>;
