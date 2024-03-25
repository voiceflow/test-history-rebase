import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord } from '@voiceflow/common';
import type {
  ProjectAIAssistSettings,
  ProjectCustomTheme,
  ProjectMember,
  ProjectNLUSettings,
  ProjectPrototype,
  ProjectReportTag,
  ProjectSticker,
} from '@voiceflow/dtos';

import { MongoEntity } from '@/mongo/common';

import type { VersionKnowledgeBase } from '../version/interfaces/version-knowledge-base.interface';

@Entity({ collection: 'projects' })
export class ProjectEntity extends MongoEntity {
  @Property({ nullable: true })
  nlu?: string;

  @Property({ nullable: true })
  type?: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  image?: string;

  @Property()
  teamID!: number;

  @Property()
  members!: ProjectMember[];

  @Property({ nullable: true })
  privacy?: 'public' | 'private';

  @Property()
  platform!: string;

  @Property({ nullable: true })
  _version?: number;

  @Property({ nullable: true })
  linkType?: string;

  @Property({ nullable: true })
  stickers?: ProjectSticker[];

  @Property()
  creatorID!: number;

  @Property({ nullable: true })
  updatedBy?: number;

  @Property({ nullable: true })
  createdAt?: Date | null;

  @Property({ nullable: true })
  updatedAt?: Date = new Date();

  @Property({ nullable: true, lazy: true })
  prototype?: ProjectPrototype;

  @Property({ nullable: true })
  apiPrivacy?: 'public' | 'private';

  @Property({ nullable: true })
  devVersion?: ObjectId;

  @Property({ nullable: true })
  liveVersion?: ObjectId;

  @Property({ nullable: true })
  previewVersion?: ObjectId;

  @Property({ nullable: true })
  reportTags?: Record<string, ProjectReportTag>;

  @Property()
  platformData!: AnyRecord;

  @Property({ nullable: true })
  customThemes?: ProjectCustomTheme[];

  @Property({ nullable: true })
  knowledgeBase?: VersionKnowledgeBase;

  @Property({ nullable: true })
  aiAssistSettings?: ProjectAIAssistSettings;

  @Property({ nullable: true })
  nluSettings?: ProjectNLUSettings;
}
