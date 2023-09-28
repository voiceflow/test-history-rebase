import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, EntityEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, EntityORM, EntityVariantORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class EntityVariantService extends MutableService<EntityVariantORM> {
  constructor(
    @Inject(EntityVariantORM)
    protected readonly orm: EntityVariantORM,
    @Inject(EntityORM)
    protected readonly entityORM: EntityORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }

  findManyByEntities(entities: PKOrEntity<EntityEntity>[]) {
    return this.orm.findManyByEntities(entities);
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.orm.findManyByAssistant(assistant);
  }
}
