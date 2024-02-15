import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';

import { MongoEntity } from '@/mongo/common';
import type { EntityCreateParams, ToJSON, ToJSONWithForeignKeys } from '@/types';

import { ProjectTemplateEntityAdapter } from './project-template-entity.adapter';

@Entity({ collection: 'templates' })
export class ProjectTemplateEntity extends MongoEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ProjectTemplateEntity>>>(data: JSON) {
    return ProjectTemplateEntityAdapter.toDB<JSON>(data);
  }

  @Property()
  tag: string;

  @Property()
  hash: string;

  @Property()
  name: string;

  @Property()
  platform: string;

  @Property()
  projectID: ObjectId;

  constructor({ tag, hash, name, platform, projectID, ...data }: EntityCreateParams<ProjectTemplateEntity>) {
    super(data);

    ({
      tag: this.tag,
      hash: this.hash,
      name: this.name,
      platform: this.platform,
      projectID: this.projectID,
    } = ProjectTemplateEntity.fromJSON({
      tag,
      hash,
      name,
      platform,
      projectID,
    }));
  }

  toJSON(): ToJSON<ProjectTemplateEntity> {
    return ProjectTemplateEntityAdapter.fromDB(this);
  }
}
