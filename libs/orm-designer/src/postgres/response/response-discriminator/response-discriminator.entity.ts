import { ArrayType, Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Channel, Language } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { ResponseEntity } from '../response.entity';

@Entity({ tableName: 'designer.response_discriminator' })
export class ResponseDiscriminatorEntity extends PostgresCMSObjectEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Enum(() => Channel)
  channel!: Channel;

  @Enum(() => Language)
  language!: Language;

  @ManyToOne(() => ResponseEntity, {
    name: 'response_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'response_id'],
  })
  response!: Ref<ResponseEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ type: ArrayType })
  variantOrder!: string[];

  [PrimaryKeyType]?: CMSCompositePK;
}
