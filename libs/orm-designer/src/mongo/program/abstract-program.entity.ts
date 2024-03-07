import { PrimaryKeyType, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { ProgramCommand, ProgramLine } from '@voiceflow/dtos';

import { cleanupUndefinedFields, MongoObjectEntity } from '@/mongo/common';
import type { EntityCreateParams } from '@/types';

import { ProgramEntityAdapter } from './program-entity.adapter';

export abstract class AbstractProgramEntity extends MongoObjectEntity {
  @Property({ nullable: true })
  name?: string;

  @Property()
  lines: Record<string, ProgramLine>;

  @Property()
  startId: string;

  @Property({ nullable: true })
  legacyID?: string;

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
    legacyID,
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
      legacyID: this.legacyID,
      diagramID: this.diagramID,
      versionID: this.versionID,
      variables: this.variables,
    } = ProgramEntityAdapter.toDB({
      name,
      lines,
      startId,
      commands,
      legacyID,
      diagramID,
      versionID,
      variables,
    }));

    cleanupUndefinedFields(this);
  }
}
