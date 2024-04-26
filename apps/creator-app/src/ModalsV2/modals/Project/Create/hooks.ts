import type { ProjectAIAssistSettings } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { FeatureFlag } from '@voiceflow/realtime-sdk';

import * as NLU from '@/config/nlu';
import * as Project from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDispatch, useFeature, useModelTracking } from '@/hooks';
import type { NLUImportModel } from '@/models';

interface CreateProjectOptions {
  name: string;
  type: Platform.Constants.ProjectType;
  image: string | null;
  listID?: string | null;
  locales: string[];
  members: Realtime.ProjectMember[];
  platform: Platform.Constants.PlatformType;
  importedModel: NLUImportModel | null;
  aiAssistSettings: ProjectAIAssistSettings | null;
}
export const useProjectCreate = () => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const createProject = useDispatch(Project.createProject);
  const redirectToDomain = useDispatch(Router.redirectToDomain);
  const redirectToProjectCanvas = useDispatch(Router.redirectToProjectCanvas);

  const modelImportTracking = useModelTracking();

  return async ({
    type,
    name,
    image,
    listID = null,
    members,
    locales,
    platform,
    importedModel,
    aiAssistSettings,
  }: CreateProjectOptions) => {
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });

    const defaultedLocales = locales.length ? locales : projectConfig.project.locale.defaultLocales;
    const projectLocales = projectConfig.project.locale.isLanguage
      ? projectConfig.utils.locale.fromLanguage(defaultedLocales[0])
      : defaultedLocales;

    const project = await createProject({
      nlu: importedModel,
      project: {
        name,
        image,
        listID,
        locales: projectLocales,
        members,
        aiAssistSettings,
      },
      modality: { type, platform },
      tracking: { onboarding: false },
    });

    if (importedModel) {
      modelImportTracking({ nluType: NLU.Voiceflow.CONFIG.type, projectID: project.id, importedModel });
    }

    if (cmsWorkflows.isEnabled) {
      redirectToProjectCanvas({ versionID: project.versionID });
    } else {
      redirectToDomain({ versionID: project.versionID });
    }
  };
};
