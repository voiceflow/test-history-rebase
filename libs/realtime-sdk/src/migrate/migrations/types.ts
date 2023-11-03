import { SchemaVersion } from '@realtime-sdk/types';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import type { Assistant } from '@voiceflow/sdk-logux-designer';
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

export interface MigrationData {
  version: VersionUpdateData;
  diagrams: DiagramUpdateData[];
}

export interface MigrationContext {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  assistant: Assistant;
  creatorID: number;
}

export type Transform = (data: Draft<MigrationData>, context: MigrationContext) => void;

export interface Migration {
  version: SchemaVersion;
  transform: Transform;
}
