import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/control';

class DomainService extends AbstractControl {
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
}

export default DomainService;
