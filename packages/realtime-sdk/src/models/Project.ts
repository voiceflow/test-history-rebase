import * as Alexa from '@voiceflow/alexa-types';
import { AnyRecord, BasePlatformData, Member, Project as BaseProject, ProjectLinkType, ProjectPrivacy } from '@voiceflow/api-sdk';
import * as General from '@voiceflow/general-types';
import { Constants } from '@voiceflow/general-types';
import * as Google from '@voiceflow/google-types';

export interface Project<D extends AnyRecord, M extends Member<any>> {
  id: string;
  name: string;
  image: string | null;
  module: string;
  isLive: boolean;
  locales: string[];
  created: string;
  privacy?: ProjectPrivacy;
  linkType: ProjectLinkType;
  platform: Constants.PlatformType;
  diagramID: string;
  versionID: string;
  workspaceID: string;
  members: M[];
  platformData: D;
  reportTags?: Record<string, { tagID: string; label: string }>;
}
export type AnyProject = Project<AnyRecord, Member<any>>;

export type AlexaProject = Alexa.Project.AlexaProject;
export type GeneralProject = General.Project.GeneralProject;
export type GoogleProject = Google.Project.GoogleProject;
export type AnyDBProject = AlexaProject | GeneralProject | GoogleProject;

export type AlexaProjectData = Alexa.Project.AlexaProjectData;
export type GoogleProjectData = Google.Project.GooglePlatformData;
export type AnyProjectData = Alexa.Project.AlexaProjectData | Google.Project.GooglePlatformData | BasePlatformData;
export type AnyProjectMemberData = Alexa.Project.AlexaProjectMemberData | Google.Project.GoogleProjectMemberData | BasePlatformData;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DBProject extends BaseProject<BasePlatformData, BasePlatformData> {}

export type NewProject = Partial<Omit<DBProject, '_id' | 'creatorID'>>;
