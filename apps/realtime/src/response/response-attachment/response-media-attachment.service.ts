import { Inject, Injectable } from '@nestjs/common';
import { ResponseMediaAttachmentORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ResponseMediaAttachmentService extends MutableService<ResponseMediaAttachmentORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(ResponseMediaAttachmentORM)
    protected readonly orm: ResponseMediaAttachmentORM
  ) {
    super();
  }

  findManyByMediaAttachments(environmentID: string, mediaIDs: string[]) {
    return this.orm.findManyByMediaAttachments(environmentID, mediaIDs);
  }
}
