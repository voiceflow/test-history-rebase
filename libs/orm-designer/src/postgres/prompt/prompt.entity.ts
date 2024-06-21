import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { Ref } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { PersonaOverrideEntity } from '../persona';

@Entity({ tableName: 'designer.prompt' })
@Unique({ properties: ['id', 'environmentID'] })
export class PromptEntity extends PostgresCMSTabularEntity<'persona'> {
  @Property({ type: MarkupType })
  text!: Markup;

  @ManyToOne(() => PersonaOverrideEntity, {
    name: 'persona_id',
    default: null,
    deleteRule: 'set default',
    nullable: true,
    fieldNames: ['persona_id', 'environment_id'],
  })
  persona!: Ref<PersonaOverrideEntity> | null;
}
