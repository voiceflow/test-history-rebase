import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '@/control';

/**
 * $TODO$ - Refactor this to contact MongoDB directly like all of the other `realtime` services, i.e,
 *
 * 1. Remove the CustomBlockClient
 * 2. Create a CustomBlockModel
 * 3. Have this CustomBlockService call the CustomBlockModel to contact MongoDB directly.
 */

class CustomBlockService extends AbstractControl {
  public async getAll(creatorID: number, projectID: string): Promise<Realtime.CustomBlock[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.customBlock.readMany(projectID);
  }

  public async get(creatorID: number, projectID: string, blockID: string): Promise<Realtime.CustomBlock> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.customBlock.read(projectID, blockID);
  }

  public async create(
    creatorID: number,
    projectID: string,
    blockData: Omit<Realtime.CustomBlock, 'id' | 'projectID'>
  ): Promise<Realtime.CustomBlock> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.customBlock.create(projectID, blockData);
  }

  public async update(
    creatorID: number,
    projectID: string,
    blockID: string,
    blockData: Omit<Realtime.CustomBlock, 'id' | 'projectID'>
  ): Promise<Omit<Realtime.CustomBlock, 'id'>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.customBlock.update(projectID, blockID, blockData);
  }

  public async delete(creatorID: number, projectID: string, blockID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.customBlock.delete(projectID, blockID);
  }
}

export default CustomBlockService;
