import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/control';

class DomainService extends AbstractControl {
  public async getAll(creatorID: number, versionID: string): Promise<BaseModels.Version.Domain[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.domain.list(versionID);
  }

  public async get(creatorID: number, versionID: string, domainID: string): Promise<BaseModels.Version.Domain> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.domain.get(versionID, domainID);
  }

  public async create(creatorID: number, versionID: string, domain: BaseModels.Version.Domain): Promise<BaseModels.Version.Domain> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.domain.create(versionID, domain);
  }

  public async patch(
    creatorID: number,
    versionID: string,
    domainID: string,
    domain: Partial<Omit<BaseModels.Version.Domain, 'id' | 'rootDiagramID'>>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.domain.update(versionID, domainID, domain);
  }

  public async delete(creatorID: number, versionID: string, domainID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.domain.delete(versionID, domainID);
  }

  public async topicAdd(creatorID: number, versionID: string, domainID: string, topicID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.domain.topicAdd(versionID, domainID, topicID);
  }

  public async topicRemove(creatorID: number, versionID: string, domainID: string, topicID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.domain.topicRemove(versionID, domainID, topicID);
  }

  public async topicReorder(creatorID: number, versionID: string, domainID: string, topicID: string, toIndex: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.domain.topicReorder(versionID, domainID, topicID, { toIndex });
  }
}

export default DomainService;
