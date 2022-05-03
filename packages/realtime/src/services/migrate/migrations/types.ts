import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { Draft } from 'immer';

export interface MigrationData<
  Node extends BaseModels.BaseDiagramNode = BaseModels.BaseDiagramNode,
  VersionPlatformData extends BaseModels.Version.PlatformData = BaseModels.Version.PlatformData
> {
  version: BaseModels.Version.Model<VersionPlatformData>;
  diagrams: BaseModels.Diagram.Model<Node>[];
}

export interface MigrationContext {
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
}

export type Transform = (data: Draft<MigrationData>, context: MigrationContext) => void;

export interface Migration {
  version: Realtime.SchemaVersion;
  transform: Transform;
}
