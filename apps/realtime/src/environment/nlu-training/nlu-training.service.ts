import { Inject, Injectable } from '@nestjs/common';
import { PrototypeIntent, PrototypeModel, PrototypeSlot } from '@voiceflow/dtos';
import orderBy from 'lodash/orderBy.js';
import { MD5 } from 'object-hash';

import { ProjectService } from '@/project/project.service';
import { VersionService } from '@/version/version.service';

import { HashedRecordDiff, ModelDiff } from './nlu-training.interface';

@Injectable()
export class EnvironmentNLUTrainingService {
  constructor(
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(ProjectService)
    private readonly project: ProjectService
  ) {}

  private hashModelData<T extends { key: string }>(array: T[]) {
    return Object.fromEntries(array.map((item) => [item.key, MD5(item)]));
  }

  private getHashedModelDataDiff(
    baseRecord: Record<string, string>,
    newRecord: Record<string, string>
  ): HashedRecordDiff {
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

    const projectHashedSlots = this.hashModelData(
      orderBy(projectModel?.slots ?? [], (slot) => slot.key).map(prepareSlot)
    );
    const projectHashedIntents = this.hashModelData(
      orderBy(projectModel?.intents ?? [], (intent) => intent.key).map(prepareIntent)
    );

    const versionHashedSlots = this.hashModelData(
      orderBy(versionModel?.slots ?? [], (slot) => slot.key).map(prepareSlot)
    );
    const versionHashedIntents = this.hashModelData(
      orderBy(versionModel?.intents ?? [], (intent) => intent.key).map(prepareIntent)
    );

    return {
      slots: this.getHashedModelDataDiff(projectHashedSlots, versionHashedSlots),
      intents: this.getHashedModelDataDiff(projectHashedIntents, versionHashedIntents),
    };
  }

  getModelDiffHash(model: ModelDiff) {
    return MD5(model);
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

  public async getNLUTrainingDiff(environmentID: string) {
    const { prototype: versionPrototype, projectID } = await this.version.findOneOrFailWithFields(environmentID, [
      'prototype',
      'projectID',
    ]);
    const { prototype: projectPrototype } = await this.project.findOneOrFailWithFields(projectID, ['prototype']);

    const modelDiff = this.getModelDiff(projectPrototype?.trainedModel, versionPrototype?.model);
    const { slots, intents } = modelDiff;

    const updatedDeletedSlotsCount = slots.deleted.length + slots.updated.length;
    const updatedDeletedIntentsCount = intents.deleted.length + intents.updated.length;

    const trainedSlotsCount = (projectPrototype?.trainedModel?.slots.length ?? 0) - updatedDeletedSlotsCount;
    const trainedIntentsCount = (projectPrototype?.trainedModel?.intents.length ?? 0) - updatedDeletedIntentsCount;

    const untrainedSlotsCount = slots.new.length + updatedDeletedSlotsCount;
    const untrainedIntentsCount = intents.new.length + updatedDeletedIntentsCount;

    const trainedCount = trainedSlotsCount + trainedIntentsCount;
    const untrainedCount = untrainedSlotsCount + untrainedIntentsCount;

    return {
      hash: this.getModelDiffHash(modelDiff),
      status: this.isModelChanged(modelDiff) ? 'untrained' : 'trained',
      data: {
        trainedCount,
        untrainedCount,
        lastTrainedTime: projectPrototype?.lastTrainedTime ?? null,
        trainedSlotsCount,
        trainedIntentsCount,
        untrainedSlotsCount,
        untrainedIntentsCount,
      },
    } as const;
  }
}
