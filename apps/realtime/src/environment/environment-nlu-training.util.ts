import { Injectable } from '@nestjs/common';
import { PrototypeIntent, PrototypeModel, PrototypeSlot } from '@voiceflow/dtos';
import orderBy from 'lodash/orderBy';
import { MD5 } from 'object-hash';

interface HashedRecordDiff {
  new: string[];
  deleted: string[];
  updated: string[];
}

interface ModelDiff {
  slots: HashedRecordDiff;
  intents: HashedRecordDiff;
}

@Injectable()
export class EnvironmentNLUTrainingUtil {
  private hashModelData<T extends { key: string }>(array: T[]) {
    return Object.fromEntries(array.map((item) => [item.key, MD5(item)]));
  }

  private getHashedModelDataDiff(baseRecord: Record<string, string>, newRecord: Record<string, string>): HashedRecordDiff {
    const newRecordKeys = Object.keys(newRecord);
    const baseRecordKeys = Object.keys(baseRecord);

    return {
      new: newRecordKeys.filter((key) => !baseRecord[key]),
      deleted: baseRecordKeys.filter((key) => !newRecord[key]),
      updated: baseRecordKeys.filter((key) => newRecord[key] && baseRecord[key] !== newRecord[key]),
    };
  }

  getModelDiff(projectModel?: PrototypeModel, versionModel?: PrototypeModel): ModelDiff {
    const prepareSlot = (intent: PrototypeSlot): PrototypeSlot => ({
      ...intent,
      inputs: [...intent.inputs].sort(),
    });

    const prepareIntent = (intent: PrototypeIntent): PrototypeIntent => ({
      ...intent,
      noteID: '',
      inputs: orderBy(intent.inputs, (intent) => intent.text),
    });

    const projectHashedSlots = this.hashModelData(orderBy(projectModel?.slots ?? [], (slot) => slot.key).map(prepareSlot));
    const projectHashedIntents = this.hashModelData(orderBy(projectModel?.intents ?? [], (intent) => intent.key).map(prepareIntent));

    const versionHashedSlots = this.hashModelData(orderBy(versionModel?.slots ?? [], (slot) => slot.key).map(prepareSlot));
    const versionHashedIntents = this.hashModelData(orderBy(versionModel?.intents ?? [], (intent) => intent.key).map(prepareIntent));

    return {
      slots: this.getHashedModelDataDiff(projectHashedSlots, versionHashedSlots),
      intents: this.getHashedModelDataDiff(projectHashedIntents, versionHashedIntents),
    };
  }

  isModelChanged(diff: ModelDiff) {
    return !!(
      diff.slots.new.length +
      diff.slots.updated.length +
      diff.slots.deleted.length +
      // intents
      diff.intents.new.length +
      diff.intents.updated.length +
      diff.intents.deleted.length
    );
  }
}
