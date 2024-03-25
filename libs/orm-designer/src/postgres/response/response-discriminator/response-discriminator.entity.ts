import { ArrayType, Entity, Enum, Index, ManyToOne, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import { Channel, Language } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { ResponseEntity } from '../response.entity';

@Entity({ tableName: 'designer.response_discriminator' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ResponseDiscriminatorEntity extends PostgresCMSObjectEntity {
  @Enum(() => Channel)
  channel!: Channel;

  @Enum(() => Language)
  language!: Language;

  @ManyToOne(() => ResponseEntity, {
    name: 'response_id',
    onDelete: 'cascade',
    fieldNames: ['response_id', 'environment_id'],
  })
  response!: Ref<ResponseEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ type: ArrayType })
  variantOrder!: string[];

  @Environment()
  environmentID!: string;

  [PrimaryKeyType]?: CMSCompositePK;
}
