import { Collection, Entity, OneToMany, Unique } from '@mikro-orm/core';

import type { ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { ResponseJSONAdapter } from './response.adapter';
import type { ResponseDiscriminatorEntity } from './response-discriminator/response-discriminator.entity';

@Entity({ tableName: 'designer.response' })
@Unique({ properties: ['id', 'environmentID'] })
export class ResponseEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ResponseEntity>>>(data: JSON) {
    return ResponseJSONAdapter.toDB<JSON>(data);
  }

  @OneToMany('ResponseDiscriminatorEntity', (value: ResponseDiscriminatorEntity) => value.response)
  responses = new Collection<ResponseDiscriminatorEntity>(this);

  toJSON(): ToJSONWithForeignKeys<ResponseEntity> {
    return ResponseJSONAdapter.fromDB({
      ...this.wrap<ResponseEntity>(),
      folder: this.folder,
      assistant: this.assistant,
    });
  }
}
