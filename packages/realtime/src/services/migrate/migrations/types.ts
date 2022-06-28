import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { Draft } from 'immer';

import type { DiagramUpdateData, VersionUpdateData } from '@/clients/voiceflow/version';

export interface MigrationData {
  version: VersionUpdateData;
  diagrams: DiagramUpdateData[];
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
