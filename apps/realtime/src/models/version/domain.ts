import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { NestedMongoModel } from '../_mongo';
import { Atomic, Bson } from '../utils';
import { DBDomainModel, DOMAIN_DATE_KEYS } from './constants';
import type VersionModel from './index';

class DomainModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'domains' as const;

  adapter = createSmartMultiAdapter<DBDomainModel, BaseModels.Version.Domain>(
    Bson.dateToString(DOMAIN_DATE_KEYS),
    Bson.stringToDate(DOMAIN_DATE_KEYS)
  );

  async create(versionID: string, domain: BaseModels.Version.Domain): Promise<BaseModels.Version.Domain> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.MODEL_PATH, value: this.adapter.toDB(domain) }])]);

    return domain;
  }

  async list(versionID: string): Promise<BaseModels.Version.Domain[]> {
    const { domains } = await this.model.findByID(versionID, [this.MODEL_PATH]);

    return this.adapter.mapFromDB(domains ?? []);
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
    const dbData = this.adapter.toDB(data);

    return this.model.atomicUpdateByID(
      versionID,
      Utils.object.getKeys(dbData).map((key) => Atomic.set([{ path: [this.MODEL_PATH, { id: domainID }, key], value: dbData[key] }]))
    );
  }

  async delete(versionID: string, domainID: string): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: { id: domainID } }])]);
  }

  async topicAdd(versionID: string, domainID: string, topicID: string, index?: number): Promise<void> {
    await this.model.atomicUpdateOne(
      {
        ...this.model.idFilter(versionID),
        [`${this.MODEL_PATH}`]: { $elemMatch: { id: domainID, topicIDs: { $ne: topicID } } },
      },
      [Atomic.push([{ path: `${this.MODEL_PATH}.$.topicIDs`, value: topicID, index }])]
    );
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
