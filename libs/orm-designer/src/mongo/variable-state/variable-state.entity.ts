import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord } from '@voiceflow/common';
import type { VariableStateStartFrom } from '@voiceflow/dtos';

import { MongoEntity } from '@/mongo/common';

@Entity({ collection: 'variable-states' })
export class VariableStateEntity extends MongoEntity {
  @Property()
  name!: string;

  @Property()
  projectID!: ObjectId;

  @Property()
  variables!: AnyRecord;

  @Property({ nullable: true })
  startFrom?: VariableStateStartFrom | null;
}
