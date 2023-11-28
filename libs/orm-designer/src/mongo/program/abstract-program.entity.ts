import { PrimaryKeyType, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';

import { MongoObjectEntity } from '@/mongo/common';
import type { EntityCreateParams } from '@/types';

import type { ProgramCommand } from './interfaces/program-command.interface';
import type { ProgramLine } from './interfaces/program-line.interface';
import { ProgramJSONAdapter } from './program.adapter';

export abstract class AbstractProgramEntity extends MongoObjectEntity {
  @Property({ nullable: true })
  name?: string;

  @Property()
  lines: Record<string, ProgramLine>;

  @Property()
  startId: string;

  @Property({ nullable: true })
  legacyId?: string;

  @Property()
  commands: ProgramCommand[];

  @Property()
  diagramID: ObjectId;

  @Property()
  versionID: ObjectId;

  @Property()
  variables: string[];

  [PrimaryKeyType]?: { diagramID: string; versionID: string };

  constructor({
    name,
    lines,
    startId,
    commands,
    legacyId,
    diagramID,
    versionID,
    variables,
    ...data
  }: EntityCreateParams<AbstractProgramEntity>) {
    super(data);

    ({
      name: this.name,
      lines: this.lines,
      startId: this.startId,
      commands: this.commands,
      legacyId: this.legacyId,
      diagramID: this.diagramID,
      versionID: this.versionID,
      variables: this.variables,
    } = ProgramJSONAdapter.toDB({
      name,
      lines,
      startId,
      commands,
      legacyId,
      diagramID,
      versionID,
      variables,
    }));
  }
}
