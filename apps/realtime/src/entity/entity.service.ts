import { Inject, Injectable } from '@nestjs/common';
import { AssistantORM, EntityORM, FolderORM, Language } from '@voiceflow/orm-designer';

import { TabularService } from '@/common';

import type { EntityCreateData } from './entity.interface';
import { EntityVariantService } from './entity-variant/entity-variant.service';

@Injectable()
export class EntityService extends TabularService<EntityORM> {
  constructor(
    @Inject(EntityORM)
    protected readonly orm: EntityORM,
    @Inject(FolderORM)
    protected readonly folderORM: FolderORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(EntityVariantService)
    private readonly entityVariant: EntityVariantService
  ) {
    super();
  }

  async createManyWithVariants(userID: number, data: EntityCreateData[]) {
    const entities = await Promise.all(
      data.map(async ({ variants: variantsData = [], ...entityData }) => {
        const entity = await this.createOneForUser(userID, entityData, { flush: false });

        if (variantsData.length) {
          const variants = await this.entityVariant.createMany(
            variantsData.map(({ value, synonyms }) => ({
              value,
              synonyms,
              language: Language.ENGLISH_US,
              entityID: entity.id,
              assistantID: entity.assistant.id,
            })),
            { flush: false }
          );

          return { entity, variants };
        }

        return { entity, variants: [] };
      })
    );

    await this.orm.em.flush();

    return {
      entities: entities.map((e) => e.entity),
      entityVariants: entities.flatMap((e) => e.variants),
    };
  }
}
