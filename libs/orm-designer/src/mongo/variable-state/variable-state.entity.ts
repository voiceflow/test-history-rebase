import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord } from '@voiceflow/common';

import { cleanupUndefinedFields, MongoEntity } from '@/mongo/common';
import type { EntityCreateParams, ToJSON, ToJSONWithForeignKeys } from '@/types';

import type { VariableStateStartFrom } from './interfaces/variable-state-start-from.interface';
import { VariableStateJSONAdapter } from './variable-state.adapter';

@Entity({ collection: 'variable-states' })
export class VariableStateEntity extends MongoEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<VariableStateEntity>>>(data: JSON) {
    return VariableStateJSONAdapter.toDB<JSON>(data);
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
    return VariableStateJSONAdapter.fromDB(this);
  }
}
