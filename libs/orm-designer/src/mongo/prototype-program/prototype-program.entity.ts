import { Entity, Unique } from '@mikro-orm/core';

import { AbstractProgramEntity } from '../program/abstract-program.entity';

@Entity({ collection: 'prototype-programs' })
@Unique({ properties: ['diagramID', 'versionID'] })
export class PrototypeProgramEntity extends AbstractProgramEntity {}
