import { Inject, Injectable } from '@nestjs/common';
import { ResponseTextVariantORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class ResponseTextVariantService extends CMSObjectService<ResponseTextVariantORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(ResponseTextVariantORM)
    protected readonly orm: ResponseTextVariantORM
  ) {
    super();
  }
}
