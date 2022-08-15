import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/control';

class CanvasTemplateService extends AbstractControl {
  public async getAll(creatorID: number, versionID: string): Promise<BaseModels.Version.CanvasTemplate[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.canvasTemplate.list(versionID);
  }

  public async get(creatorID: number, versionID: string, canvasTemplateID: string): Promise<BaseModels.Version.CanvasTemplate> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.canvasTemplate.get(versionID, canvasTemplateID);
  }

  public async create(
    creatorID: number,
    versionID: string,
    canvasTemplate: BaseModels.Version.CanvasTemplate
  ): Promise<BaseModels.Version.CanvasTemplate> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.canvasTemplate.create(versionID, canvasTemplate);
  }

  public async patch(
    creatorID: number,
    versionID: string,
    canvasTemplateID: string,
    canvasTemplate: Partial<Omit<BaseModels.Version.CanvasTemplate, 'id'>>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.canvasTemplate.update(versionID, canvasTemplateID, canvasTemplate);
  }

  public async delete(creatorID: number, versionID: string, canvasTemplateID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.canvasTemplate.delete(versionID, canvasTemplateID);
  }
}

export default CanvasTemplateService;
