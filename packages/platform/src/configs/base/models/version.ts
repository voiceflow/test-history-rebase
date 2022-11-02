import { BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { Required } from 'utility-types';

export interface PlatformData extends BaseModels.Version.PlatformData {
  status?: unknown;
}

export interface Session {
  restart: boolean;
  resumePrompt: {
    voice: Nullable<string>;
    content: string;
    followVoice: Nullable<string>;
    followContent: Nullable<string>;
  };
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

export interface Model extends Required<Pick<BaseModels.Version.Model<any>, ModelDBSharedFields>, ModelDBRequiredFields> {
  id: string;
  status: Nullable<unknown>;
  session: Nullable<Session>;
  settings: unknown;
  publishing: unknown;
}
