import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseMessageEntity, ResponseMessageObject, ResponseMessageORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class ResponseMessageRepository extends CMSObjectService<ResponseMessageORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(ResponseMessageORM)
    public readonly orm: ResponseMessageORM
  ) {
    super();
  }

  findOneOrFail(id: Primary<ResponseMessageEntity>): Promise<ResponseMessageObject> {
    return this.orm.findOneOrFail(id);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByDiscriminators(environmentID: string, discriminatorIDs: string[]) {
    return this.orm.findManyByDiscriminators(environmentID, discriminatorIDs);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  // TODO: fixme: add condition object
  createOne(data: any) {
    return this.orm.createOne(data);
  }

  // TODO: fixme: add condition object
  createMany(data: Array<any>) {
    return this.orm.createMany(data);
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }
}
