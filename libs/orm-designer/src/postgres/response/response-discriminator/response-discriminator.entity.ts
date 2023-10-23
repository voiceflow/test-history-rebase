import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  ref,
  Unique,
} from '@mikro-orm/core';

import { Channel, Language } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { ResponseEntity } from '../response.entity';
import { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';

@Entity({ tableName: 'designer.response_discriminator' })
@Unique({ properties: ['id', 'environmentID'] })
export class ResponseDiscriminatorEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ResponseDiscriminatorEntity>>({
    responseID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(responseID !== undefined && { response: ref(ResponseEntity, { id: responseID, environmentID }) }),
      }),
    } as ResolvedForeignKeys<ResponseDiscriminatorEntity, Data>;
  }

  @Enum(() => Channel)
  channel: Channel;

  @Enum(() => Language)
  language: Language;

  @OneToMany(() => BaseResponseVariantEntity, (value) => value.discriminator)
  variants = new Collection<BaseResponseVariantEntity>(this);

  @ManyToOne(() => ResponseEntity, {
    name: 'response_id',
    onDelete: 'cascade',
    fieldNames: ['response_id', 'environment_id'],
  })
  response: Ref<ResponseEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Property({ type: ArrayType })
  variantOrder: string[];

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<ResponseDiscriminatorEntity>) {
    super(data);

    ({
      channel: this.channel,
      language: this.language,
      response: this.response,
      assistant: this.assistant,
      variantOrder: this.variantOrder,
      environmentID: this.environmentID,
    } = ResponseDiscriminatorEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      responseID: this.response.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
