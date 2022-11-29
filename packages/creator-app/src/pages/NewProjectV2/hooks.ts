import { useDispatch } from '@logux/redux';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

interface UpdateChannelOptions {
  type: Platform.Constants.ProjectType;
  locales: string[];
  platform: Platform.Constants.PlatformType;
  versionID: string;
  projectID: string;
  projectName: string;
  invocationName: string | null;
}

export const useUpdateChannelMeta = () => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const dispatch = useDispatch();

  return async ({ type, locales, platform, versionID, projectID, projectName, invocationName }: UpdateChannelOptions) => {
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });

    const localeDefaultVoice = projectConfig.utils.voice.getLocaleDefault(locales);

    const storeLocalesInPublishing = projectConfig.project.locale.storedIn === 'publishing';
    const invocationNameDataToStore =
      invocationName && projectConfig.project.invocationName
        ? {
            invocationName,
            invocationNameSamples: projectConfig.project.invocationName.defaultSamples.map((sample) => `${sample} ${invocationName}`),
          }
        : null;

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
            ...{ displayName: projectName },
            ...(storeLocalesInPublishing && { locales }),
            ...invocationNameDataToStore,
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
