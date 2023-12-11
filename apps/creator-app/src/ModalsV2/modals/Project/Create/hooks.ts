import { useDispatch as useLoguxDispatch } from '@logux/redux';
import { ProjectAIAssistSettings } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import * as NLU from '@/config/nlu';
import * as Project from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useFeature, useModelTracking, useSelector } from '@/hooks';
import { NLUImportModel } from '@/models';

interface CreateProjectOptions {
  name: string;
  type: Platform.Constants.ProjectType;
  image: string | null;
  listID?: string;
  locales: string[];
  members: Realtime.ProjectMember[];
  platform: Platform.Constants.PlatformType;
  importedModel: NLUImportModel | null;
  aiAssistSettings: ProjectAIAssistSettings | null;
}

interface UpdateChannelOptions {
  type: Platform.Constants.ProjectType;
  locales: string[];
  versionID: string;
  projectID: string;
  platform: Platform.Constants.PlatformType;
}

export const useUpdateChannelMeta = () => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const dispatch = useLoguxDispatch();

  return async ({ type, locales, platform, versionID, projectID }: UpdateChannelOptions) => {
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });

    const localeDefaultVoice = projectConfig.utils.voice.getLocaleDefault(locales);

    const storeLocalesInPublishing = projectConfig.project.locale.storedIn === 'publishing';

    const actionContext = {
      type,
      platform,
      versionID,
      projectID,
      workspaceID,
      defaultVoice: localeDefaultVoice ?? projectConfig.project.voice.default,
    };

    await Promise.all([
      dispatch.sync(
        Realtime.version.patchPublishing({
          ...actionContext,
          publishing: {
            ...(storeLocalesInPublishing && { locales }),
          },
        })
      ),
      dispatch.sync(
        Realtime.version.patchSettings({
          ...actionContext,
          settings: {
            ...(!storeLocalesInPublishing && { locales }),
            ...(localeDefaultVoice && { defaultVoice: localeDefaultVoice }),
          },
        })
      ),
    ]);
  };
};

export const useProjectCreate = () => {
  const createProject = useDispatch(Project.createProject);
  const redirectToDomain = useDispatch(Router.redirectToDomain);

  const modelImportTracking = useModelTracking();
  const onUpdateChannelMeta = useUpdateChannelMeta();
  const vfFileAssistantTemplate = useFeature(Realtime.FeatureFlag.VFFILE_ASSISTANT_TEMPLATE);

  return async ({ type, name, image, listID, members, locales, platform, importedModel, aiAssistSettings }: CreateProjectOptions) => {
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });
    const platformConfig = Platform.Config.get(platform);

    const defaultedLocales = locales.length ? locales : projectConfig.project.locale.defaultLocales;
    const projectLocales = projectConfig.project.locale.isLanguage ? projectConfig.utils.locale.fromLanguage(defaultedLocales[0]) : defaultedLocales;

    let templateTag = Object.keys(platformConfig.types).length > 1 ? type : 'default';

    if (
      vfFileAssistantTemplate.isEnabled &&
      !projectLocales.map(projectConfig.utils.locale.toVoiceflowLocale).includes(VoiceflowConstants.Locale.EN_US)
    ) {
      templateTag = `${templateTag}:empty`;
    }

    const project = await createProject({
      name,
      image: image ?? undefined,
      listID,
      nluType: NLU.Voiceflow.CONFIG.type,
      members,
      platform,
      projectType: type,
      templateTag,
      aiAssistSettings,
      tracking: {
        language: projectConfig.project.locale.labelMap[defaultedLocales[0]],
        onboarding: false,
      },
    });

    await onUpdateChannelMeta({
      type,
      locales: projectLocales,
      platform,
      versionID: project.versionID,
      projectID: project.id,
    });

    if (importedModel) {
      await client.version.patchMergeIntentsAndSlots(project.versionID, importedModel);

      modelImportTracking({ nluType: NLU.Voiceflow.CONFIG.type, projectID: project.id, importedModel });
    }

    redirectToDomain({ versionID: project.versionID });
  };
};
