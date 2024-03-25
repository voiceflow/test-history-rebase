import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { MediaAttachmentEntity } from './media-attachment.entity';
import { MediaAttachmentJSONAdapter } from './media-attachment-json.adapter';

export class MediaAttachmentORM extends PostgresCMSObjectORM<MediaAttachmentEntity> {
  Entity = MediaAttachmentEntity;

  jsonAdapter = MediaAttachmentJSONAdapter;

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
