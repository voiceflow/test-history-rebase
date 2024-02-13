import type { AssistantEntity, CMSTabularORM, FolderEntity, ORMEntity, ORMParam, PKOrEntity } from '@voiceflow/orm-designer';

import { CMSObjectService } from './cms-object.service';

export abstract class CMSTabularService<Orm extends CMSTabularORM<any, any>> extends CMSObjectService<Orm> {
  protected abstract readonly orm: CMSTabularORM<ORMEntity<Orm>, ORMParam<Orm>>;

  findManyByFolders(folders: PKOrEntity<FolderEntity>[]): Promise<ORMEntity<Orm>[]> {
    return this.orm.findManyByFolders(folders);
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<ORMEntity<Orm>[]> {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<void> {
    return this.orm.deleteManyByEnvironment(assistant, environmentID);
  }
}
