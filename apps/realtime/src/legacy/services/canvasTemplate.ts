import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/legacy/control';

class CanvasTemplateService extends AbstractControl {
  public async getAll(versionID: string): Promise<BaseModels.Version.CanvasTemplate[]> {
    return this.models.version.canvasTemplate.list(versionID);
  }

  public async get(versionID: string, canvasTemplateID: string): Promise<BaseModels.Version.CanvasTemplate> {
    return this.models.version.canvasTemplate.get(versionID, canvasTemplateID);
  }

  public async create(versionID: string, canvasTemplate: BaseModels.Version.CanvasTemplate): Promise<BaseModels.Version.CanvasTemplate> {
    return this.models.version.canvasTemplate.create(versionID, canvasTemplate);
  }

  public async patch(
    versionID: string,
    canvasTemplateID: string,
    canvasTemplate: Partial<Omit<BaseModels.Version.CanvasTemplate, 'id'>>
  ): Promise<void> {
    await this.models.version.canvasTemplate.update(versionID, canvasTemplateID, canvasTemplate);
  }

  public async delete(versionID: string, canvasTemplateID: string): Promise<void> {
    await this.models.version.canvasTemplate.delete(versionID, canvasTemplateID);
  }
}

export default CanvasTemplateService;
