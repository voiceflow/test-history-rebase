import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { FolderEntity } from './folder.entity';
import { FolderJSONAdapter } from './folder-json.adapter';

export class FolderORM extends PostgresCMSObjectORM<FolderEntity> {
  Entity = FolderEntity;

  jsonAdapter = FolderJSONAdapter;

  findManyParents(environmentID: string, folderIDs: string[]) {
    return this.find({ environmentID, parentID: folderIDs });
  }

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.find({ environmentID, id: ids });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.delete({ environmentID, id: ids });
  }
}
