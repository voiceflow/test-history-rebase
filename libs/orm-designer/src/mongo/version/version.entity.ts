import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord } from '@voiceflow/common';
import type {
  VersionCanvasTemplate,
  VersionCustomBlock,
  VersionFolder,
  VersionFolderItem,
  VersionNote,
  VersionPrototype,
  VersionSettings,
} from '@voiceflow/dtos';

import { MongoObjectEntity } from '@/mongo/common';

import type { VersionDomain } from './interfaces/version-domain.interface';
import type { VersionKnowledgeBase } from './interfaces/version-knowledge-base.interface';

@Entity({ collection: 'versions' })
export class VersionEntity extends MongoObjectEntity {
  @Property()
  name!: string;

  @Property({ nullable: true })
  notes?: Record<string, VersionNote>;

  /**
   * @deprecated use domains instead
   */

  @Property({ nullable: true })
  topics?: VersionFolderItem[];

  @Property({ nullable: true })
  folders?: Record<string, VersionFolder>;

  @Property({ nullable: true })
  domains?: VersionDomain[];

  @Property({ nullable: true })
  legacyID?: string;

  @Property()
  _version!: number;

  @Property({ nullable: true })
  settings?: VersionSettings;

  @Property()
  creatorID!: number;

  @Property()
  projectID!: ObjectId;

  @Property({ nullable: true })
  prototype?: VersionPrototype;

  @Property()
  variables!: string[];

  @Property({ nullable: true })
  components?: VersionFolderItem[];

  @Property({ nullable: true })
  manualSave?: boolean;

  @Property()
  platformData!: AnyRecord;

  @Property({ nullable: true })
  customBlocks?: Record<string, VersionCustomBlock>;

  @Property()
  rootDiagramID!: ObjectId;

  @Property({ nullable: true })
  knowledgeBase?: VersionKnowledgeBase;

  @Property({ nullable: true })
  canvasTemplates?: VersionCanvasTemplate[];

  @Property({ nullable: true })
  templateDiagramID?: ObjectId;

  @Property({ nullable: true })
  defaultStepColors?: Record<string, string>;

  /**
   * @deprecated in favor of legacyID
   */

  @Property({ nullable: true })
  secondaryVersionID?: number;

  @Property({ nullable: true })
  autoSaveFromRestore?: boolean;
}
