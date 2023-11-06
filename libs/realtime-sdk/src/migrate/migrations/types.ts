import { AnyProject } from '@realtime-sdk/models';
import { SchemaVersion } from '@realtime-sdk/types';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import { CMSData } from '@voiceflow/sdk-logux-designer';
import { Draft } from 'immer';

export type VersionUpdateData = Pick<
  BaseVersion.Version<any>,
  | '_version'
  | 'name'
  | 'variables'
  | 'rootDiagramID'
  | 'platformData'
  | 'topics'
  | 'folders'
  | 'components'
  | 'canvasTemplates'
  | 'defaultStepColors'
  | 'templateDiagramID'
  | 'domains'
>;

export type DiagramUpdateData = Omit<BaseModels.Diagram.Model, '_id' | 'creatorID' | 'versionID'> & { readonly _id: string };

export type CMSMigrationData = CMSData;

export interface MigrationData {
  version: VersionUpdateData;
  diagrams: DiagramUpdateData[];
  cms?: CMSMigrationData;
}

export interface MigrationContext {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  project: AnyProject;
  creatorID: number;
}

export type Transform = (data: Draft<MigrationData>, context: MigrationContext) => void;

export interface Migration {
  version: SchemaVersion;
  transform: Transform;
}
