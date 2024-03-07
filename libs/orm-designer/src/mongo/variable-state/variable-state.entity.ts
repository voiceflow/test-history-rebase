import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord } from '@voiceflow/common';
import type { VariableStateStartFrom } from '@voiceflow/dtos';

import { cleanupUndefinedFields, MongoEntity } from '@/mongo/common';
import type { EntityCreateParams, ToJSON, ToJSONWithForeignKeys } from '@/types';

import { VariableStateEntityAdapter } from './variable-state-entity.adapter';

@Entity({ collection: 'variable-states' })
export class VariableStateEntity extends MongoEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<VariableStateEntity>>>(data: JSON) {
    return VariableStateEntityAdapter.toDB<JSON>(data);
  }

  @Property()
  name: string;

  @Property()
  projectID: ObjectId;

  @Property()
  variables: AnyRecord;

  @Property({ nullable: true })
  startFrom?: VariableStateStartFrom | null;

  constructor({ name, projectID, variables, startFrom, ...data }: EntityCreateParams<VariableStateEntity>) {
    super(data);

    ({
      name: this.name,
      projectID: this.projectID,
      variables: this.variables,
      startFrom: this.startFrom,
    } = VariableStateEntity.fromJSON({
      name,
      projectID,
      variables,
      startFrom,
    }));

    cleanupUndefinedFields(this);
  }

  toJSON(): ToJSON<VariableStateEntity> {
    return VariableStateEntityAdapter.fromDB(this);
  }
}
