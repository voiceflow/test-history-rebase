import { Inject, Injectable } from '@nestjs/common';
import { AssistantORM, CardAttachmentORM, MediaAttachmentORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class CardAttachmentService extends CMSObjectService<CardAttachmentORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(CardAttachmentORM)
    protected readonly orm: CardAttachmentORM,
    @Inject(MediaAttachmentORM)
    protected readonly mediaORM: MediaAttachmentORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.orm.deleteManyByEnvironment(environmentID);
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }
}
