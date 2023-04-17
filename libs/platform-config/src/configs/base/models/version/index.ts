import { BaseVersion } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { Required } from 'utility-types';

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

export type ModelDBRequiredFields = 'folders' | 'components';

export type ModelDBSharedFields =
  | ModelDBRequiredFields
  | 'creatorID'
  | '_version'
  | 'variables'
  | 'projectID'
  | 'rootDiagramID'
  | 'templateDiagramID'
  | 'defaultStepColors';

export interface Model extends Required<Pick<BaseVersion.Version, ModelDBSharedFields>, ModelDBRequiredFields> {
  id: string;
  status: Nullable<unknown>;
  session: Session;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
