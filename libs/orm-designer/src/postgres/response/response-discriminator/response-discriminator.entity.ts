import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';

import { Channel, Language } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { ResponseEntity } from '../response.entity';
import type { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';
import { ResponseDiscriminatorEntityAdapter } from './response-discriminator-entity.adapter';

@Entity({ tableName: 'designer.response_discriminator' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ResponseDiscriminatorEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ResponseDiscriminatorEntity>>>(data: JSON) {
    return ResponseDiscriminatorEntityAdapter.toDB<JSON>(data);
  }

  @Enum(() => Channel)
  channel: Channel;

  @Enum(() => Language)
  language: Language;

  @OneToMany('BaseResponseVariantEntity', (value: BaseResponseVariantEntity) => value.discriminator)
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
    } = ResponseDiscriminatorEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ResponseDiscriminatorEntity> {
    return ResponseDiscriminatorEntityAdapter.fromDB({
      ...wrap<ResponseDiscriminatorEntity>(this).toObject(...args),
      response: this.response,
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}
