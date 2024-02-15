import { Entity, Unique } from '@mikro-orm/core';

import type { ToJSON, ToJSONWithForeignKeys } from '@/types';

import { AbstractProgramEntity } from '../program/abstract-program.entity';
import { PrototypeProgramEntityAdapter } from './prototype-program-entity.adapter';

@Entity({ collection: 'prototype-programs' })
@Unique({ properties: ['diagramID', 'versionID'] })
export class PrototypeProgramEntity extends AbstractProgramEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PrototypeProgramEntity>>>(data: JSON) {
    return PrototypeProgramEntityAdapter.toDB<JSON>(data);
  }

  toJSON(): ToJSON<PrototypeProgramEntity> {
    return PrototypeProgramEntityAdapter.fromDB(this);
  }
}
