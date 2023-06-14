import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Adapters } from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';

import { AbstractControl } from '@/control';

class CustomBlockService extends AbstractControl {
  adaptToDB = (data: Omit<Realtime.CustomBlock, 'id'>) => {
    const { key, ...rest } = Adapters.customBlockAdapter.toDB({ id: 'dummy', ...data });
    return rest;
  };

  public async getAll(versionID: string): Promise<Realtime.CustomBlock[]> {
    const { customBlocks } = await this.models.version.findByID(versionID, ['customBlocks']);

    return Adapters.customBlockAdapter.mapFromDB(Object.values(customBlocks || {}));
  }

  public async create(versionID: string, blockData: Omit<Realtime.CustomBlock, 'id'>): Promise<Realtime.CustomBlock> {
    const block: Realtime.CustomBlock = {
      ...blockData,
      id: new ObjectId().toHexString(),
    };

    await this.models.version.customBlock.upsert(versionID, Adapters.customBlockAdapter.toDB(block));

    return block;
  }

  public async update(versionID: string, blockID: string, blockData: Omit<Realtime.CustomBlock, 'id'>): Promise<Omit<Realtime.CustomBlock, 'id'>> {
    await this.models.version.customBlock.update(versionID, blockID, this.adaptToDB(blockData));

    return blockData;
  }

  public async delete(versionID: string, blockID: string): Promise<void> {
    return this.models.version.customBlock.delete(versionID, blockID);
  }
}

export default CustomBlockService;
