import { PrimaryKeyType, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { ProgramCommand, ProgramLine } from '@voiceflow/dtos';

import { MongoObjectEntity } from '@/mongo/common';

export abstract class AbstractProgramEntity extends MongoObjectEntity {
  @Property({ nullable: true })
  name?: string;

  @Property()
  lines!: Record<string, ProgramLine>;

  @Property()
  startId!: string;

  @Property({ nullable: true })
  legacyID?: string;

  @Property()
  commands!: ProgramCommand[];

  @Property()
  diagramID!: ObjectId;

  @Property()
  versionID!: ObjectId;

  @Property()
  variables!: string[];

  [PrimaryKeyType]?: { diagramID: string; versionID: string };
}
