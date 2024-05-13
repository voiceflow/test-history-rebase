import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { Ref } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { PersonaOverrideEntity } from '../persona';

@Entity({ tableName: 'designer.prompt' })
export class PromptEntity extends PostgresCMSTabularEntity<'persona'> {
  @Property({ type: MarkupType })
  text!: Markup;

  @ManyToOne(() => PersonaOverrideEntity, {
    name: 'persona_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['environment_id', 'persona_id'],
  })
  persona!: Ref<PersonaOverrideEntity> | null;
}
