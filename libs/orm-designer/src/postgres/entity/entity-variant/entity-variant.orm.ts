import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import type { EntityEntity } from '../entity.entity';
import { EntityVariantEntity } from './entity-variant.entity';

export class EntityVariantORM extends PostgresCMSMutableORM(EntityVariantEntity) {
  findManyByEntities(entities: PKOrEntity<EntityEntity>[]) {
    return this.find({ entity: entities });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(EntityVariantEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }
}
