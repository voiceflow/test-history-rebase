import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/control';

class SlotService extends AbstractControl {
  public async get<Slot extends BaseModels.Slot>(versionID: string, slotKey: string): Promise<Slot> {
    return this.models.version.slot.get<Slot>(versionID, slotKey);
  }

  public async getMany<Slot extends BaseModels.Slot>(versionID: string, slotKeys: string[]): Promise<Slot[]> {
    return this.models.version.slot.getMany<Slot>(versionID, slotKeys);
  }

  public async getAll<Slot extends BaseModels.Slot>(versionID: string): Promise<Slot[]> {
    return this.models.version.slot.list<Slot>(versionID);
  }

  public async create<Slot extends BaseModels.Slot>(versionID: string, slot: Slot): Promise<void> {
    await this.models.version.slot.create(versionID, slot);
  }

  public async createMany<Slot extends BaseModels.Slot>(versionID: string, slots: Slot[]): Promise<void> {
    await this.models.version.slot.createMany(versionID, slots);
  }

  public async update(versionID: string, slotKey: string, slot: Partial<BaseModels.Slot>): Promise<void> {
    await this.models.version.slot.update(versionID, slotKey, slot);
  }

  public async delete(versionID: string, slotKey: string): Promise<void> {
    await this.models.version.slot.delete(versionID, slotKey);
  }

  public async deleteMany(versionID: string, slotKeys: string[]): Promise<void> {
    await this.models.version.slot.deleteMany(versionID, slotKeys);
  }
}

export default SlotService;
