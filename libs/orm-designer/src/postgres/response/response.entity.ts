import { Collection, Entity, OneToMany, Unique } from '@mikro-orm/core';

import type { ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { ResponseDiscriminatorEntity } from './response-discriminator/response-discriminator.entity';

@Entity({ tableName: 'designer.response' })
@Unique({ properties: ['id', 'environmentID'] })
export class ResponseEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ResponseEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<ResponseEntity, Data>;
  }

  @OneToMany(() => ResponseDiscriminatorEntity, (value) => value.response)
  responses = new Collection<ResponseDiscriminatorEntity>(this);
}
