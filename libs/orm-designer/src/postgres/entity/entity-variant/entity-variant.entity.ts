import { ArrayType, Entity as EntityDecorator, Enum, ManyToOne, PrimaryKeyType, Property, ref } from '@mikro-orm/core';

import { Language } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { EntityEntity } from '../entity.entity';

@EntityDecorator({ tableName: 'designer.entity_variant' })
@SoftDelete()
export class EntityVariantEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<EntityVariantEntity>>({
    entityID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(entityID !== undefined && { entity: ref(EntityEntity, { id: entityID, environmentID }) }),
      }),
    } as ResolvedForeignKeys<EntityVariantEntity, Data>;
  }

  @Enum(() => Language)
  language: Language;

  @Property()
  value: string;

  @Property({ type: ArrayType })
  synonyms: string[];

  @ManyToOne(() => EntityEntity, { name: 'entity_id', fieldNames: ['entity_id', 'environment_id'] })
  entity: Ref<EntityEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<EntityVariantEntity>) {
    super();

    ({
      value: this.value,
      entity: this.entity,
      synonyms: this.synonyms,
      language: this.language,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = EntityVariantEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      entityID: this.entity.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
