import { Entity, ManyToOne, Property, ref, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity, SoftDelete } from '../common';
import { PersonaOverrideEntity } from '../persona';

@Entity({ tableName: 'designer.prompt' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class PromptEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<PromptEntity>>({
    personaID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
      ...(environmentID !== undefined && {
        environmentID,
        ...(personaID !== undefined && {
          persona: personaID ? ref(PersonaOverrideEntity, { id: personaID, environmentID }) : null,
        }),
      }),
    } as ResolvedForeignKeys<PromptEntity, Data>;
  }

  @Property({ type: MarkupType })
  text: Markup;

  @ManyToOne(() => PersonaOverrideEntity, {
    name: 'persona_id',
    default: null,
    fieldNames: ['persona_id', 'environment_id'],
  })
  persona: Ref<PersonaOverrideEntity> | null;

  constructor({ text, personaID, ...data }: EntityCreateParams<PromptEntity>) {
    super(data);

    ({ text: this.text, persona: this.persona } = PromptEntity.resolveForeignKeys({ text, personaID }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      personaID: this.persona?.id ?? null,
    };
  }
}
