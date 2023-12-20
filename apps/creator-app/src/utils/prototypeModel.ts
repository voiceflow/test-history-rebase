import { BaseModels } from '@voiceflow/base-types';
import orderBy from 'lodash/orderBy';
import { MD5 } from 'object-hash';

export interface HashedRecordDiff {
  new: string[];
  deleted: string[];
  updated: string[];
}

export interface ModelDiff {
  slots: HashedRecordDiff;
  intents: HashedRecordDiff;
}

export const getHashedRecordByKey = <T extends { key: string }>(array: T[]) =>
  array.reduce<Record<string, string>>((acc, item) => Object.assign(acc, { [item.key]: MD5(item) }), {});

export const getHashedRecordsDiffs = (baseRecord: Record<string, string>, newRecord: Record<string, string>): HashedRecordDiff => {
  const newRecordKeys = Object.keys(newRecord);
  const baseRecordKeys = Object.keys(baseRecord);

  return {
    new: newRecordKeys.filter((key) => !baseRecord[key]),
    deleted: baseRecordKeys.filter((key) => !newRecord[key]),
    updated: baseRecordKeys.filter((key) => newRecord[key] && baseRecord[key] !== newRecord[key]),
  };
};

export const getModelsDiffs = (projectModel: BaseModels.PrototypeModel, versionModel: BaseModels.PrototypeModel): ModelDiff => {
  const prepareSlot = (intent: BaseModels.Slot): BaseModels.Slot => ({
    ...intent,
    inputs: [...intent.inputs].sort(),
  });

  const prepareIntent = (intent: BaseModels.Intent): BaseModels.Intent => ({
    ...intent,
    noteID: '',
    inputs: orderBy(intent.inputs, (intent) => intent.text),
  });

  const projectHashedSlotsRecord = getHashedRecordByKey(orderBy(projectModel.slots, (slot) => slot.key).map(prepareSlot));
  const projectHashedIntentsRecord = getHashedRecordByKey(orderBy(projectModel.intents, (intent) => intent.key).map(prepareIntent));

  const versionHashedSlotsRecord = getHashedRecordByKey(orderBy(versionModel.slots, (slot) => slot.key).map(prepareSlot));
  const versionHashedIntentsRecord = getHashedRecordByKey(orderBy(versionModel.intents, (intent) => intent.key).map(prepareIntent));

  return {
    slots: getHashedRecordsDiffs(projectHashedSlotsRecord, versionHashedSlotsRecord),
    intents: getHashedRecordsDiffs(projectHashedIntentsRecord, versionHashedIntentsRecord),
  };
};

export const isModelChanged = (diff: ModelDiff) =>
  [diff.slots.new, diff.slots.updated, diff.slots.deleted, diff.intents.new, diff.intents.updated, diff.intents.deleted].some(
    (changes) => changes.length
  );
