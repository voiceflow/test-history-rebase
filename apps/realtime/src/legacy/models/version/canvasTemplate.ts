import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

class CanvasTemplateModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'canvasTemplates' as const;

  async create(versionID: string, canvasTemplate: BaseModels.Version.CanvasTemplate): Promise<BaseModels.Version.CanvasTemplate> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.MODEL_PATH, value: canvasTemplate }])]);

    return canvasTemplate;
  }

  async list(versionID: string): Promise<BaseModels.Version.CanvasTemplate[]> {
    const { canvasTemplates } = await this.model.findByID(versionID, [this.MODEL_PATH]);

    return canvasTemplates ?? [];
  }

  async get(versionID: string, templateID: string): Promise<BaseModels.Version.CanvasTemplate> {
    const canvasTemplates = await this.list(versionID);

    const canvasTemplate = canvasTemplates.find(({ id }) => id === templateID);

    if (!canvasTemplate) {
      throw new Error("Couldn't find canvas template");
    }

    return canvasTemplate;
  }

  async update(versionID: string, templateID: string, data: Partial<Omit<BaseModels.Version.CanvasTemplate, 'id'>>): Promise<void> {
    return this.model.atomicUpdateByID(
      versionID,
      Utils.object.getKeys(data).map((key) => Atomic.set([{ path: [this.MODEL_PATH, { id: templateID }, key], value: data[key] }]))
    );
  }

  async delete(versionID: string, templateID: string): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: { id: templateID } }])]);
  }
}

export default CanvasTemplateModel;
