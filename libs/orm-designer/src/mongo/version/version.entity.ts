import { Entity, Property } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';
import type { AnyRecord } from '@voiceflow/common';

import { MongoEntity } from '@/mongo/common';
import type { EntityCreateParams, ToJSON, ToJSONWithForeignKeys } from '@/types';

import type { VersionCanvasTemplate } from './interfaces/version-canvas-template.interface';
import type { VersionCustomBlock } from './interfaces/version-custom-block.interface';
import type { VersionDomain } from './interfaces/version-domain.interface';
import type { VersionFolder, VersionFolderItem } from './interfaces/version-folder.interface';
import type { VersionKnowledgeBase } from './interfaces/version-knowledge-base.interface';
import type { VersionNLUUnclassifiedData } from './interfaces/version-nlu-unclassified-data.interface';
import type { VersionNote } from './interfaces/version-note.interface';
import { VersionJSONAdapter } from './version.adapter';

@Entity({ collection: 'versions' })
export class VersionEntity extends MongoEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<VersionEntity>>>(data: JSON) {
    return VersionJSONAdapter.toDB<JSON>(data);
  }

  @Property()
  name: string;

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
  _version: number;

  @Property()
  creatorID: number;

  @Property()
  projectID: ObjectId;

  @Property({ nullable: true })
  prototype?: AnyRecord;

  @Property()
  variables: string[];

  @Property({ nullable: true })
  components?: VersionFolderItem[];

  @Property({ nullable: true })
  manualSave?: boolean;

  @Property()
  platformData: AnyRecord;

  @Property({ nullable: true })
  customBlocks?: Record<string, VersionCustomBlock>;

  @Property()
  rootDiagramID: ObjectId;

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

  @Property({ nullable: true })
  nluUnclassifiedData?: VersionNLUUnclassifiedData[];

  constructor({
    name,
    notes,
    topics,
    folders,
    domains,
    legacyID,
    _version,
    creatorID,
    projectID,
    prototype,
    variables,
    components,
    manualSave,
    platformData,
    customBlocks,
    rootDiagramID,
    knowledgeBase,
    canvasTemplates,
    templateDiagramID,
    defaultStepColors,
    secondaryVersionID,
    autoSaveFromRestore,
    nluUnclassifiedData,
    ...data
  }: EntityCreateParams<VersionEntity>) {
    super(data);

    ({
      name: this.name,
      notes: this.notes,
      topics: this.topics,
      folders: this.folders,
      domains: this.domains,
      legacyID: this.legacyID,
      _version: this._version,
      creatorID: this.creatorID,
      projectID: this.projectID,
      prototype: this.prototype,
      variables: this.variables,
      components: this.components,
      manualSave: this.manualSave,
      platformData: this.platformData,
      customBlocks: this.customBlocks,
      rootDiagramID: this.rootDiagramID,
      knowledgeBase: this.knowledgeBase,
      canvasTemplates: this.canvasTemplates,
      templateDiagramID: this.templateDiagramID,
      defaultStepColors: this.defaultStepColors,
      secondaryVersionID: this.secondaryVersionID,
      autoSaveFromRestore: this.autoSaveFromRestore,
      nluUnclassifiedData: this.nluUnclassifiedData,
    } = VersionEntity.fromJSON({
      name,
      notes,
      topics,
      folders,
      domains,
      legacyID,
      _version,
      creatorID,
      projectID,
      prototype,
      variables,
      components,
      manualSave,
      platformData,
      customBlocks,
      rootDiagramID,
      knowledgeBase,
      canvasTemplates,
      templateDiagramID,
      defaultStepColors,
      secondaryVersionID,
      autoSaveFromRestore,
      nluUnclassifiedData,
    }));
  }

  toJSON(): ToJSON<VersionEntity> {
    return VersionJSONAdapter.fromDB(this);
  }
}
