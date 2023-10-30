import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { PersonaOverrideEntity } from '../persona';
import { PromptJSONAdapter } from './prompt.adapter';

@Entity({ tableName: 'designer.prompt' })
@Unique({ properties: ['id', 'environmentID'] })
export class PromptEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PromptEntity>>>(data: JSON) {
    return PromptJSONAdapter.toDB<JSON>(data);
  }

  @Property({ type: MarkupType })
  text: Markup;

  @ManyToOne(() => PersonaOverrideEntity, {
    name: 'persona_id',
    default: null,
    onDelete: 'set default',
    fieldNames: ['persona_id', 'environment_id'],
  })
  persona: Ref<PersonaOverrideEntity> | null;

  constructor({ text, personaID, ...data }: EntityCreateParams<PromptEntity>) {
    super(data);

    ({ text: this.text, persona: this.persona } = PromptEntity.fromJSON({ text, personaID }));
  }

  toJSON(): ToJSONWithForeignKeys<PromptEntity> {
    return PromptJSONAdapter.fromDB({
      ...this.wrap<PromptEntity>(),
      folder: this.folder,
      persona: this.persona,
      assistant: this.assistant,
    });
  }
}
