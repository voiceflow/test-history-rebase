import { Entity, Unique } from '@mikro-orm/core';

import { AbstractProgramEntity } from './abstract-program.entity';

@Entity({ collection: 'programs' })
@Unique({ properties: ['diagramID', 'versionID'] })
export class ProgramEntity extends AbstractProgramEntity {}
