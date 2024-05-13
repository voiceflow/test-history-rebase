import { Entity, Index, ManyToOne, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { Ref } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { PersonaOverrideEntity } from '../persona';

@Entity({ tableName: 'designer.prompt' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class PromptEntity extends PostgresCMSTabularEntity<'persona'> {
  @Property({ type: MarkupType })
  text!: Markup;

  @ManyToOne(() => PersonaOverrideEntity, {
    name: 'persona_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['persona_id', 'environment_id'],
  })
  persona!: Ref<PersonaOverrideEntity> | null;
}
