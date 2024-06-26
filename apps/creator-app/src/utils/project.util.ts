import type { BaseModels } from '@voiceflow/base-types';
import type { AnyRecord } from '@voiceflow/common';
import type { Project } from '@voiceflow/dtos';
import type { AssistantPublicHTTPControllerImportFile201Project } from '@voiceflow/sdk-http-designer/generated';

type AnyBaseProject = BaseModels.Project.Model<AnyRecord, AnyRecord>;

export const projectToLegacyBaseProject = (
  project: Project | AssistantPublicHTTPControllerImportFile201Project
): BaseModels.Project.Model<AnyRecord, AnyRecord> => ({
  ...project,
  privacy: project.privacy as AnyBaseProject['privacy'],
  linkType: project.linkType as AnyBaseProject['linkType'],
  prototype: project.prototype as AnyBaseProject['prototype'],
  apiPrivacy: project.apiPrivacy as AnyBaseProject['apiPrivacy'],
  customThemes: project.customThemes as AnyBaseProject['customThemes'],
  knowledgeBase: project.knowledgeBase as AnyBaseProject['knowledgeBase'],
});
