import { Entity, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { BaseConditionEntity } from '@/postgres/condition';
import type { CMSCompositePK, Ref } from '@/types';

import { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';

const TABLE_NAME = 'designer.response_message';

@Entity({
  tableName: TABLE_NAME,
})
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ResponseMessageEntity<DefaultOrNullColumn extends string = never> extends PostgresCMSObjectEntity<
  DefaultOrNullColumn | 'condition'
> {
  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  @ManyToOne(() => ResponseDiscriminatorEntity, {
    name: 'discriminator_id',
    deleteRule: 'cascade',
    fieldNames: ['discriminator_id', 'environment_id'],
  })
  discriminator!: Ref<ResponseDiscriminatorEntity>;

  @Property({ type: MarkupType })
  text!: Markup;

  @ManyToOne(() => BaseConditionEntity, {
    name: 'condition_id',
    default: null,
    deleteRule: 'set default',
    nullable: true,
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition!: Ref<BaseConditionEntity> | null;

  @Property({ type: 'int', nullable: true })
  delay!: number | null;

  [PrimaryKeyProp]?: CMSCompositePK;
}
