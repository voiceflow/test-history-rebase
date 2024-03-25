import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { CardAttachmentEntity } from './card-attachment.entity';
import { CardAttachmentJSONAdapter } from './card-attachment-json.adapter';

export class CardAttachmentORM extends PostgresCMSObjectORM<CardAttachmentEntity> {
  Entity = CardAttachmentEntity;

  jsonAdapter = CardAttachmentJSONAdapter;

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
