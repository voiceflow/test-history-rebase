/* eslint-disable max-classes-per-file */

import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { BaseResponseVariantEntity, TextResponseVariantEntity } from './response-variant.entity';
import type { AnyResponseVariantEntity } from './response-variant.interface';
import { BaseResponseVariantJSONAdapter, TextResponseVariantJSONAdapter } from './response-variant-json.adapter';

export class ResponseTextVariantORM extends PostgresCMSObjectORM<TextResponseVariantEntity> {
  Entity = TextResponseVariantEntity;

  jsonAdapter = TextResponseVariantJSONAdapter;

  findManyByDiscriminators(environmentID: string, discriminatorIDs: string[]) {
    return this.find({ environmentID, discriminatorID: discriminatorIDs });
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

export class AnyResponseVariantORM extends PostgresCMSObjectORM<BaseResponseVariantEntity, AnyResponseVariantEntity> {
  Entity = BaseResponseVariantEntity;

  jsonAdapter = BaseResponseVariantJSONAdapter;

  protected discriminators = [{ Entity: TextResponseVariantEntity, jsonAdapter: TextResponseVariantJSONAdapter }];

  findManyByDiscriminators(environmentID: string, discriminatorIDs: string[]) {
    return this.find({ environmentID, discriminatorID: discriminatorIDs });
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
