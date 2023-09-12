import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import _ from 'lodash';

import { AbstractControl } from '@/legacy/control';

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

  public async getAllTopicNames(versionID: string, domainID: string): Promise<string[]> {
    const domain = await this.models.version.domain.get(versionID, domainID);

    return this.services.diagram.getNamesByIDs(domain.topicIDs);
  }

  public async duplicate(creatorID: number, versionID: string, domainID: string) {
    const allDomains = await this.services.domain.getAll(versionID);
    const domain = allDomains.find((domain) => domain.id === domainID);

    if (!domain) {
      throw new Error(`Domain with id ${domainID} not found!`);
    }

    const allSubtopicsIDs = await this.services.diagram.getFlatSubtopicIDsByTopicIDs(domain.topicIDs);

    const { diagrams, diagramIDRemap } = await this.services.diagram.cloneMany(creatorID, versionID, [...domain.topicIDs, ...allSubtopicsIDs]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(
      domain.name,
      allDomains.map((domain) => domain.name)
    );

    const newDomain = await this.create(versionID, {
      ...domain,
      id: Utils.id.objectID(),
      name: uniqueName,
      topicIDs: domain.topicIDs.map((topicID) => diagramIDRemap[topicID]),
      updatedAt: new Date().toJSON(),
      updatedBy: creatorID,
      rootDiagramID: diagramIDRemap[domain.rootDiagramID],
    });

    return {
      domain: newDomain,
      diagrams,
    };
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
      this.log.warn(error, "couldn't set domain updated by");
    }
  }, CANVAS_UPDATE_THROTTLE_TIME);
}

export default DomainService;
