import type { AlexaProject } from '@voiceflow/alexa-types';
import type { AnyRecord, BaseModels } from '@voiceflow/base-types';
import type { ProjectUserRole } from '@voiceflow/dtos';
import type { DFESProject } from '@voiceflow/google-dfes-types';
import type * as Platform from '@voiceflow/platform-config/backend';
import type { VoiceflowProject } from '@voiceflow/voiceflow-types';
import type * as Normal from 'normal-store';

export interface ProjectMember {
  role: ProjectUserRole;
  creatorID: number;
}

export interface Project<D extends AnyRecord, M extends BaseModels.Project.Member<any>> {
  id: string;
  _version?: number;
  diagramID: string;
  versionID: string;
  workspaceID: string;
  liveVersion?: string;

  members: Normal.Normalized<ProjectMember>;

  platformData: D;
  platformMembers: Normal.Normalized<M>;

  nlu: Platform.Constants.NLUType;
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;

  updatedAt?: string;
  updatedBy?: number;

  name: string;
  image: string | null;
  module: string;
  isLive: boolean;
  locales: string[];
  created: string;
  privacy?: BaseModels.Project.Privacy;
  linkType: BaseModels.Project.LinkType;
  prototype?: BaseModels.Project.Prototype;
  apiPrivacy?: BaseModels.Project.Privacy;
  reportTags?: Record<string, { tagID: string; label: string }>;
  nluSettings?: BaseModels.Project.NLUSettings;
  customThemes: BaseModels.Project.Themes;
  aiAssistSettings: BaseModels.Project.AIAssistSettings;
}

export type AnyProject = Project<AnyRecord, BaseModels.Project.Member<any>>;

export type AlexaProject = AlexaProject.Project;
export type VoiceflowProject = VoiceflowProject.Project;
export type DialogflowProject = DFESProject.Project;

export type AnyDBProject = AlexaProject | VoiceflowProject | DialogflowProject;

export interface DBProject extends BaseModels.Project.Model<AnyRecord, AnyRecord> {}

export type NewProject = Partial<Omit<DBProject, '_id' | 'creatorID'>>;
