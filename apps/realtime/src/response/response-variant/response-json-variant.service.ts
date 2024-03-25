import { Inject, Injectable } from '@nestjs/common';
import { ResponseJSONVariantORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class ResponseJSONVariantService extends CMSObjectService<ResponseJSONVariantORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(ResponseJSONVariantORM)
    protected readonly orm: ResponseJSONVariantORM
  ) {
    super();
  }
}
