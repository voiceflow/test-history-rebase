import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { Atomic } from '../utils';
import type VersionModel from './index';

class DomainModel {
  MODEL_PATH = 'domains' as const;

  constructor(private model: VersionModel) {}

  async create(versionID: string, domain: BaseModels.Version.Domain): Promise<BaseModels.Version.Domain> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.MODEL_PATH, value: domain }])]);

    return domain;
  }

  async list(versionID: string): Promise<BaseModels.Version.Domain[]> {
    const { domains } = await this.model.findByID(versionID, [this.MODEL_PATH]);

    return domains ?? [];
  }

  async get(versionID: string, domainID: string): Promise<BaseModels.Version.Domain> {
    const domains = await this.list(versionID);

    const domain = domains.find(({ id }) => id === domainID);

    if (!domain) {
      throw new Error("Couldn't find domain");
    }

    return domain;
  }

  async update(versionID: string, domainID: string, data: Partial<Omit<BaseModels.Version.Domain, 'id' | 'rootDiagramID'>>): Promise<void> {
    return this.model.atomicUpdateByID(
      versionID,
      Utils.object.getKeys(data).map((key) => Atomic.set([{ path: [this.MODEL_PATH, { id: domainID }, key], value: data[key] }]))
    );
  }

  async delete(versionID: string, domainID: string): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: { id: domainID } }])]);
  }

  async topicAdd(versionID: string, domainID: string, topicID: string, index?: number): Promise<void> {
    await this.model.atomicUpdateOne({ ...this.model.idFilter(versionID), [`${this.MODEL_PATH}.id`]: domainID }, [
      Atomic.push([{ path: `${this.MODEL_PATH}.$.topicIDs`, value: topicID, index }]),
    ]);
  }

  async topicRemove(versionID: string, domainID: string, topicID: string): Promise<void> {
    await this.model.atomicUpdateOne({ ...this.model.idFilter(versionID), [`${this.MODEL_PATH}.id`]: domainID }, [
      Atomic.pull([{ path: `${this.MODEL_PATH}.$.topicIDs`, match: topicID }]),
    ]);
  }

  async topicReorder(versionID: string, domainID: string, topicID: string, index: number): Promise<void> {
    await this.topicRemove(versionID, domainID, topicID);
    await this.topicAdd(versionID, domainID, topicID, index);
  }
}

export default DomainModel;
