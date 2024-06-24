import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseMessageEntity, ResponseMessageObject, ResponseMessageORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

import { ResponseMessageCreateData } from './response-message.interface';

type CreateResponseMessagePayload = ResponseMessageCreateData & { assistantID: string; environmentID: string };

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

  createOne(data: CreateResponseMessagePayload) {
    return this.orm.createOne(data);
  }

  createMany(data: Array<CreateResponseMessagePayload>) {
    return this.orm.createMany(data);
  }

  createManyForUser(userID: number, data: Array<CreateResponseMessagePayload>) {
    return this.orm.createManyForUser(userID, data);
  }

  createManyWithSubResources(userID: number, messages: Array<CreateResponseMessagePayload>) {
    // TODO: add condition creation here
    return this.createManyForUser(userID, messages);
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }
}
