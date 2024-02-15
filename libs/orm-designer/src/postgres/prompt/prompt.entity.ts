import { Entity, ManyToOne, Property, Unique, wrap } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { PersonaOverrideEntity } from '../persona';
import { PromptEntityAdapter } from './prompt-entity.adapter';

@Entity({ tableName: 'designer.prompt' })
@Unique({ properties: ['id', 'environmentID'] })
export class PromptEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PromptEntity>>>(data: JSON) {
    return PromptEntityAdapter.toDB<JSON>(data);
  }

  @Property({ type: MarkupType })
  text: Markup;

  @ManyToOne(() => PersonaOverrideEntity, {
    name: 'persona_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['persona_id', 'environment_id'],
  })
  persona: Ref<PersonaOverrideEntity> | null = null;

  constructor({ text, personaID, ...data }: EntityCreateParams<PromptEntity>) {
    super(data);

    ({ text: this.text, persona: this.persona } = PromptEntity.fromJSON({ text, personaID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<PromptEntity> {
    return PromptEntityAdapter.fromDB({
      ...wrap<PromptEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      persona: this.persona ?? null,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      assistant: this.assistant,
    });
  }
}
