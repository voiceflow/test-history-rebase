import { Entity } from '@mikro-orm/core';

import type { ToJSON, ToJSONWithForeignKeys } from '@/types';

import { AbstractProgramEntity } from '../program/abstract-program.entity';
import { PrototypeProgramJSONAdapter } from './prototype-program.adapter';

@Entity({ collection: 'prototype-programs' })
export class PrototypeProgramEntity extends AbstractProgramEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PrototypeProgramEntity>>>(data: JSON) {
    return PrototypeProgramJSONAdapter.toDB<JSON>(data);
  }

  toJSON(): ToJSON<PrototypeProgramEntity> {
    return PrototypeProgramJSONAdapter.fromDB(this);
  }
}
