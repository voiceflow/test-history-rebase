import type { CMSTabularORM, ORMDiscriminatorEntity, ORMEntity } from '@voiceflow/orm-designer';

import { CMSObjectService } from './cms-object.service';

export abstract class CMSTabularService<Orm extends CMSTabularORM<any, any>> extends CMSObjectService<Orm> {
  protected abstract readonly orm: CMSTabularORM<ORMEntity<Orm>, ORMDiscriminatorEntity<Orm>>;

  findManyByFolders(environmentID: string, folderIDs: string[]) {
    return this.orm.findManyByFolders(environmentID, folderIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  async deleteManyByEnvironment(environmentID: string): Promise<void> {
    await this.orm.deleteManyByEnvironment(environmentID);
  }

  async deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    await this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }
}
