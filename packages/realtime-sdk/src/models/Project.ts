import { AlexaProject } from '@voiceflow/alexa-types';
import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { DFESProject } from '@voiceflow/google-dfes-types';
import { GoogleProject } from '@voiceflow/google-types';
import { VoiceflowConstants, VoiceflowProject } from '@voiceflow/voiceflow-types';

export interface Project<D extends AnyRecord, M extends BaseModels.Project.Member<any>> {
  id: string;
  name: string;
  image: string | null;
  module: string;
  isLive: boolean;
  locales: string[];
  created: string;
  privacy?: BaseModels.Project.Privacy;
  apiPrivacy?: BaseModels.Project.Privacy;
  linkType: BaseModels.Project.LinkType;
  prototype?: BaseModels.Project.Prototype;
  customThemes: BaseModels.Project.Themes;

  type: VoiceflowConstants.ProjectType;
  platform: VoiceflowConstants.PlatformType;

  _version?: number;
  diagramID: string;
  versionID: string;
  liveVersion?: string;
  workspaceID: string;
  members: M[];
  platformData: D;
  reportTags?: Record<string, { tagID: string; label: string }>;
}
export type AnyProject = Project<AnyRecord, BaseModels.Project.Member<any>>;

export type AlexaProject = AlexaProject.Project;
export type GoogleProject = GoogleProject.VoiceProject;
export type VoiceflowProject = VoiceflowProject.Project;
export type DialogflowProject = DFESProject.Project;

export type AnyDBProject = AlexaProject | VoiceflowProject | GoogleProject | DialogflowProject;

export type AlexaProjectData = AlexaProject.PlatformData;
export type GoogleProjectData = GoogleProject.VoicePlatformData;
export type DialogflowProjectData = DFESProject.PlatformData;

export type AnyProjectData = AlexaProjectData | GoogleProjectData | DialogflowProjectData;

export type AnyProjectMemberData = DFESProject.MemberPlatformData | AlexaProject.MemberPlatformData | GoogleProject.VoiceMemberPlatformData;

export type AnyProjectMember = BaseModels.Project.Member<AnyProjectMemberData>;

export interface DBProject extends BaseModels.Project.Model<AnyRecord, AnyRecord> {}

export type NewProject = Partial<Omit<DBProject, '_id' | 'creatorID'>>;
