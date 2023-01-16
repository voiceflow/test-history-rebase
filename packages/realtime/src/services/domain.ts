import { BaseModels } from '@voiceflow/base-types';
import _ from 'lodash';

import { AbstractControl } from '@/control';
import logger from '@/logger';

const CANVAS_UPDATE_THROTTLE_TIME = 30 * 1000; // 30 seconds

class DomainService extends AbstractControl {
  private static getUpdatedDebounceKey({ versionID, domainID }: { versionID: string; domainID: string }): string {
    return `versions:${versionID}:domains:${domainID}:updated-throttle`;
  }

  // needs this to throttle canvas updates on multiple instances
  private updatedThrottleCache = this.clients.cache.createKeyValue({
    expire: CANVAS_UPDATE_THROTTLE_TIME / 1000,
    keyCreator: DomainService.getUpdatedDebounceKey,
  });

  public async getAll(versionID: string): Promise<BaseModels.Version.Domain[]> {
    return this.models.version.domain.list(versionID);
  }

  public async get(versionID: string, domainID: string): Promise<BaseModels.Version.Domain> {
    return this.models.version.domain.get(versionID, domainID);
  }

  public async create(versionID: string, domain: BaseModels.Version.Domain): Promise<BaseModels.Version.Domain> {
    return this.models.version.domain.create(versionID, domain);
  }

  public async patch(versionID: string, domainID: string, domain: Partial<Omit<BaseModels.Version.Domain, 'id' | 'rootDiagramID'>>): Promise<void> {
    await this.models.version.domain.update(versionID, domainID, domain);
  }

  public async delete(versionID: string, domainID: string): Promise<void> {
    await this.models.version.domain.delete(versionID, domainID);
  }

  public async topicAdd(versionID: string, domainID: string, topicID: string): Promise<void> {
    await this.models.version.domain.topicAdd(versionID, domainID, topicID);
  }

  public async topicRemove(versionID: string, domainID: string, topicID: string): Promise<void> {
    await this.models.version.domain.topicRemove(versionID, domainID, topicID);
  }

  public async topicReorder(versionID: string, domainID: string, topicID: string, toIndex: number): Promise<void> {
    await this.models.version.domain.topicReorder(versionID, domainID, topicID, toIndex);
  }

  // eslint-disable-next-line you-dont-need-lodash-underscore/throttle
  public setUpdatedBy = _.throttle(async (versionID: string, domainID: string, creatorID: number) => {
    try {
      // skipping if the canvas was updated in another instance
      if (await this.updatedThrottleCache.get({ versionID, domainID })) return;

      await Promise.all([
        this.models.version.domain.update(versionID, domainID, { updatedAt: new Date().toJSON(), updatedBy: creatorID }),
        this.updatedThrottleCache.set({ versionID, domainID }, `${creatorID}`),
      ]);
    } catch (error) {
      logger.warn(error);
    }
  }, CANVAS_UPDATE_THROTTLE_TIME);
}

export default DomainService;
