import { Inject, Injectable } from '@nestjs/common';
import { ResponseCardAttachmentORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ResponseCardAttachmentService extends MutableService<ResponseCardAttachmentORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(ResponseCardAttachmentORM)
    protected readonly orm: ResponseCardAttachmentORM
  ) {
    super();
  }

  findManyByCardAttachments(environmentID: string, cardIDs: string[]) {
    return this.orm.findManyByCardAttachments(environmentID, cardIDs);
  }
}
