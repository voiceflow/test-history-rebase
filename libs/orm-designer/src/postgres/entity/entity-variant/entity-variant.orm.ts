import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { EntityEntity } from '../entity.entity';
import { EntityVariantEntity } from './entity-variant.entity';

export class EntityVariantORM extends PostgresCMSObjectORM(EntityVariantEntity) {
  findManyByEntities(entities: PKOrEntity<EntityEntity>[]) {
    return this.find({ entity: entities });
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}
