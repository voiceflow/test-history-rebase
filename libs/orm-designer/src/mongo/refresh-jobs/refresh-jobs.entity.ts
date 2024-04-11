import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import { KnowledgeBaseDocumentRefreshRate } from '@voiceflow/dtos';

import { MongoEntity } from '@/mongo/common';

@Entity({ collection: 'refresh-jobs' })
@Unique({ properties: ['projectID', 'documentID'] })
export class RefreshJobsEntity extends MongoEntity {
  @Property()
  projectID!: ObjectId;

  @Property()
  documentID!: ObjectId;

  @Property()
  workspaceID!: number;

  @Property()
  url!: string;

  @Property()
  name!: string;

  @Property()
  executeAt!: Date;

  @Enum(() => KnowledgeBaseDocumentRefreshRate)
  refreshRate!: KnowledgeBaseDocumentRefreshRate;

  @Property({ nullable: true })
  checksum?: string | null;

  @Property()
  tags?: string[];

  @Property()
  integrationOauthTokenID?: number;

  @Property()
  integrationExternalID?: string;
}
