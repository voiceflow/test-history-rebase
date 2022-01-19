import * as Alexa from '@voiceflow/alexa-types';
import { AnyRecord, Models as BaseModels } from '@voiceflow/base-types';
import * as General from '@voiceflow/general-types';
import { Constants } from '@voiceflow/general-types';
import * as Dialogflow from '@voiceflow/google-dfes-types';
import * as Google from '@voiceflow/google-types';

export interface Project<D extends AnyRecord, M extends BaseModels.Member<any>> {
  id: string;
  name: string;
  image: string | null;
  module: string;
  isLive: boolean;
  locales: string[];
  created: string;
  privacy?: BaseModels.ProjectPrivacy;
  linkType: BaseModels.ProjectLinkType;
  prototype?: BaseModels.ProjectPrototype;
  platform: Constants.PlatformType;
  _version?: number;
  diagramID: string;
  versionID: string;
  workspaceID: string;
  members: M[];
  platformData: D;
  reportTags?: Record<string, { tagID: string; label: string }>;
}
export type AnyProject = Project<AnyRecord, BaseModels.Member<any>>;

export type AlexaProject = Alexa.Project.AlexaProject;
export type GeneralProject = General.Project.GeneralProject;
export type GoogleProject = Google.Project.GoogleProject;
export type DialogflowProject = Dialogflow.Project.GoogleDFESProject;
export type AnyDBProject = AlexaProject | GeneralProject | GoogleProject | DialogflowProject;

export type AlexaProjectData = Alexa.Project.AlexaProjectData;
export type GoogleProjectData = Google.Project.GooglePlatformData;
export type DialogflowProjectData = Google.Project.BaseGooglePlatformData;
export type AnyProjectData = AlexaProjectData | GoogleProjectData | DialogflowProjectData | BaseModels.BasePlatformData;
export type AnyProjectMemberData =
  | Alexa.Project.AlexaProjectMemberData
  | Google.Project.GoogleProjectMemberData
  | Dialogflow.Project.GoogleDFESProjectMemberData
  | BaseModels.BasePlatformData;
export type AnyProjectMember = BaseModels.Member<AnyProjectMemberData>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DBProject extends BaseModels.Project<BaseModels.BasePlatformData, BaseModels.BasePlatformData> {}

export type NewProject = Partial<Omit<DBProject, '_id' | 'creatorID'>>;
