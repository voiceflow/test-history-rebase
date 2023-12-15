import { ProjectAIAssistSettings } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as NLU from '@/config/nlu';
import * as Project from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDispatch, useModelTracking } from '@/hooks';
import { NLUImportModel } from '@/models';

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
  const createProject = useDispatch(Project.createProject);
  const redirectToDomain = useDispatch(Router.redirectToDomain);

  const modelImportTracking = useModelTracking();

  return async ({ type, name, image, listID = null, members, locales, platform, importedModel, aiAssistSettings }: CreateProjectOptions) => {
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });

    const defaultedLocales = locales.length ? locales : projectConfig.project.locale.defaultLocales;
    const projectLocales = projectConfig.project.locale.isLanguage ? projectConfig.utils.locale.fromLanguage(defaultedLocales[0]) : defaultedLocales;

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

    redirectToDomain({ versionID: project.versionID });
  };
};
