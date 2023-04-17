import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';

import { getActivePlatformVersionContext } from '../utils';

export const platformFactory = <
  Session extends Platform.Base.Models.Version.Session,
  Settings extends Platform.Base.Models.Version.Settings.Model,
  Publishing extends Platform.Base.Models.Version.Publishing.Model
>() => {
  const patchSession =
    (session: Partial<Session>): Thunk =>
    async (dispatch, getState) => {
      const state = getState();
      const defaultVoice = VersionV2.active.voice.defaultVoiceSelector(state);
      const activeSession = VersionV2.active.sessionSelector(state);
      const activePlatformContext = getActivePlatformVersionContext(state);

      if (!activeSession) throw Errors.noActiveVersionID();

      await dispatch.sync(Realtime.version.patchSession({ ...activePlatformContext, session, defaultVoice }));
    };

  const patchSettings =
    (settings: Partial<Settings>, options: { defaultVoice?: string } = {}): Thunk =>
    async (dispatch, getState) => {
      const state = getState();
      const defaultVoice = options.defaultVoice ?? VersionV2.active.voice.defaultVoiceSelector(state);
      const activePlatformContext = getActivePlatformVersionContext(state);

      await dispatch.sync(Realtime.version.patchSettings({ ...activePlatformContext, settings, defaultVoice }));
    };

  const patchPublishing =
    (publishing: Partial<Publishing>): Thunk =>
    async (dispatch, getState) => {
      const state = getState();
      const defaultVoice = VersionV2.active.voice.defaultVoiceSelector(state);
      const activePlatformContext = getActivePlatformVersionContext(state);

      await dispatch.sync(Realtime.version.patchPublishing({ ...activePlatformContext, publishing, defaultVoice }));
    };

  return {
    patchSession,
    patchSettings,
    patchPublishing,
  };
};
