import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { Atomic } from '../utils';
import { PlatformDataModel } from './utils';

class SlotModel extends PlatformDataModel {
  readonly MODEL_PATH = 'slots' as const;

  async create<Slot extends BaseModels.Slot>(versionID: string, slot: Slot): Promise<Slot> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.PLATFORM_DATA_MODEL_PATH, value: slot }])]);

    return slot;
  }

  async createMany<Slot extends BaseModels.Slot>(versionID: string, slots: Slot[]): Promise<Slot[]> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.PLATFORM_DATA_MODEL_PATH, value: slots }])]);

    return slots;
  }

  async list<Slot extends BaseModels.Slot>(versionID: string): Promise<Slot[]> {
    const { platformData } = await this.model.findByID(versionID, [this.PLATFORM_DATA_PATH]);

    return platformData.slots as Slot[];
  }

  async getMany<Slot extends BaseModels.Slot>(versionID: string, slotKeys: string[]): Promise<Slot[]> {
    const slots = await this.list<Slot>(versionID);

    return slots.filter(({ key }) => slotKeys.includes(key));
  }

  async get<Slot extends BaseModels.Slot>(versionID: string, slotKey: string): Promise<Slot> {
    const slots = await this.list<Slot>(versionID);

    const slot = slots.find(({ key }) => key === slotKey);

    if (!slot) {
      throw new Error("Couldn't find slot");
    }

    return slot;
  }

  async update(versionID: string, slotKey: string, data: Partial<Omit<BaseModels.Slot, 'key'>>): Promise<void> {
    return this.model.atomicUpdateByID(
      versionID,
      Utils.object.getKeys(data).map((key) => Atomic.set([{ path: [this.PLATFORM_DATA_MODEL_PATH, { key: slotKey }, key], value: data[key] }]))
    );
  }

  async delete(versionID: string, slotKey: string): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.PLATFORM_DATA_MODEL_PATH, match: { key: slotKey } }])]);
  }

  async deleteMany(versionID: string, slotKeys: string[]): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.PLATFORM_DATA_MODEL_PATH, match: { key: { $in: slotKeys } } }])]);
  }
}

export default SlotModel;
