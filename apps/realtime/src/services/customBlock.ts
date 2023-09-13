import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Adapters } from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '@/control';

class CustomBlockService extends AbstractControl {
  adaptToDB = (data: Omit<Realtime.CustomBlock, 'id'>) => {
    const { key, ...rest } = Adapters.customBlockAdapter.toDB({ id: 'dummy', ...data });
    return rest;
  };

  public async createMany(versionID: string, blocksData: Realtime.CustomBlock[]): Promise<Realtime.CustomBlock[]> {
    const customBlocks = Adapters.customBlockAdapter.mapToDB(Object.values(blocksData || []));

    await this.models.version.customBlock.upsertMany(versionID, customBlocks);

    return blocksData;
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
