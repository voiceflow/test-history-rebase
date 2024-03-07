import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord } from '@voiceflow/common';
import type {
  ProjectAIAssistSettings,
  ProjectCustomTheme,
  ProjectMember,
  ProjectNLUSettings,
  ProjectReportTag,
  ProjectSticker,
} from '@voiceflow/dtos';

import { cleanupUndefinedFields, MongoEntity } from '@/mongo/common';
import type { EntityCreateParams, ToJSON, ToJSONWithForeignKeys } from '@/types';

import type { VersionKnowledgeBase } from '../version/interfaces/version-knowledge-base.interface';
import { ProjectEntityAdapter } from './project-entity.adapter';

@Entity({ collection: 'projects' })
export class ProjectEntity extends MongoEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ProjectEntity>>>(data: JSON) {
    return ProjectEntityAdapter.toDB<JSON>(data);
  }

  @Property({ nullable: true })
  nlu?: string;

  @Property({ nullable: true })
  type?: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  image?: string;

  @Property()
  teamID: number;

  @Property()
  members: ProjectMember[];

  @Property({ nullable: true })
  privacy?: 'public' | 'private';

  @Property()
  platform: string;

  @Property({ nullable: true })
  _version?: number;

  @Property({ nullable: true })
  linkType?: string;

  @Property({ nullable: true })
  stickers?: ProjectSticker[];

  @Property()
  creatorID: number;

  @Property({ nullable: true })
  updatedBy?: number;

  @Property({ nullable: true })
  createdAt?: Date | null;

  @Property({ nullable: true })
  updatedAt?: Date = new Date();

  @Property({ nullable: true, lazy: true })
  prototype?: AnyRecord;

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
  platformData: AnyRecord;

  @Property({ nullable: true })
  customThemes?: ProjectCustomTheme[];

  @Property({ nullable: true })
  knowledgeBase?: VersionKnowledgeBase;

  @Property({ nullable: true })
  aiAssistSettings?: ProjectAIAssistSettings;

  @Property({ nullable: true })
  nluSettings?: ProjectNLUSettings;

  constructor({
    nlu,
    type,
    name,
    image,
    teamID,
    members,
    privacy,
    platform,
    _version,
    linkType,
    stickers,
    creatorID,
    updatedBy,
    prototype,
    apiPrivacy,
    devVersion,
    liveVersion,
    reportTags,
    platformData,
    customThemes,
    knowledgeBase,
    previewVersion,
    aiAssistSettings,
    ...data
  }: EntityCreateParams<ProjectEntity>) {
    super(data);

    ({
      nlu: this.nlu,
      type: this.type,
      name: this.name,
      image: this.image,
      teamID: this.teamID,
      members: this.members,
      privacy: this.privacy,
      platform: this.platform,
      _version: this._version,
      linkType: this.linkType,
      stickers: this.stickers,
      creatorID: this.creatorID,
      updatedBy: this.updatedBy,
      prototype: this.prototype,
      apiPrivacy: this.apiPrivacy,
      devVersion: this.devVersion,
      liveVersion: this.liveVersion,
      reportTags: this.reportTags,
      platformData: this.platformData,
      customThemes: this.customThemes,
      knowledgeBase: this.knowledgeBase,
      previewVersion: this.previewVersion,
      aiAssistSettings: this.aiAssistSettings,
    } = ProjectEntity.fromJSON({
      nlu,
      type,
      name,
      image,
      teamID,
      members,
      privacy,
      platform,
      _version,
      linkType,
      stickers,
      creatorID,
      updatedBy,
      prototype,
      apiPrivacy,
      devVersion,
      liveVersion,
      reportTags,
      platformData,
      customThemes,
      knowledgeBase,
      previewVersion,
      aiAssistSettings,
    }));

    cleanupUndefinedFields(this);
  }

  toJSON(): ToJSON<ProjectEntity> {
    return ProjectEntityAdapter.fromDB(this);
  }
}
