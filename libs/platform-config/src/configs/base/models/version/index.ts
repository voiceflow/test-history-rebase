import type { BaseVersion } from '@voiceflow/base-types';
import type { Nullable } from '@voiceflow/common';
import type { VersionSettings } from '@voiceflow/dtos';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface PlatformData extends BaseVersion.PlatformData {
  status?: unknown;
}

export interface Session {
  restart: boolean;
  resumePrompt: unknown;
}

export type ModelDBSharedFields =
  | 'creatorID'
  | '_version'
  | 'projectID'
  | 'rootDiagramID'
  | 'templateDiagramID'
  | 'defaultStepColors';

export interface Model extends Pick<BaseVersion.Version, ModelDBSharedFields> {
  id: string;
  status: Nullable<unknown>;
  session: Session;
  settings: Settings.Model;
  settingsV2?: VersionSettings;
  publishing: Publishing.Model;
}
