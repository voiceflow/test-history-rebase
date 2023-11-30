import { Entity, Unique } from '@mikro-orm/core';

import type { ToJSON, ToJSONWithForeignKeys } from '@/types';

import { AbstractProgramEntity } from './abstract-program.entity';
import { ProgramJSONAdapter } from './program.adapter';

@Entity({ collection: 'programs' })
@Unique({ properties: ['diagramID', 'versionID'] })
export class ProgramEntity extends AbstractProgramEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ProgramEntity>>>(data: JSON) {
    return ProgramJSONAdapter.toDB<JSON>(data);
  }

  toJSON(): ToJSON<ProgramEntity> {
    return ProgramJSONAdapter.fromDB(this);
  }
}
