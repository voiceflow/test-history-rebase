import { Collection, Entity, Index, OneToMany, Unique, wrap } from '@mikro-orm/core';

import type { ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import type { ResponseDiscriminatorEntity } from './response-discriminator/response-discriminator.entity';
import { ResponseEntityAdapter } from './response-entity.adapter';

@Entity({ tableName: 'designer.response' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ResponseEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ResponseEntity>>>(data: JSON) {
    return ResponseEntityAdapter.toDB<JSON>(data);
  }

  @OneToMany('ResponseDiscriminatorEntity', (value: ResponseDiscriminatorEntity) => value.response)
  responses = new Collection<ResponseDiscriminatorEntity>(this);

  toJSON(...args: any[]): ToJSONWithForeignKeys<ResponseEntity> {
    return ResponseEntityAdapter.fromDB({
      ...wrap<ResponseEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      assistant: this.assistant,
    });
  }
}
