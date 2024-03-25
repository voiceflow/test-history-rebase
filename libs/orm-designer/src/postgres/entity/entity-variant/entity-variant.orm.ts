import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { EntityVariantEntity } from './entity-variant.entity';
import { EntityVariantJSONAdapter } from './entity-variant-json.adapter';
import { EntityVariantObjectAdapter } from './entity-variant-object.adapter';

export class EntityVariantORM extends PostgresCMSObjectORM<EntityVariantEntity> {
  Entity = EntityVariantEntity;

  jsonAdapter = EntityVariantJSONAdapter;

  objectAdapter = EntityVariantObjectAdapter;

  findManyByEntities(environmentID: string, entityIDs: string[]) {
    return this.find({ environmentID, entityID: entityIDs });
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
