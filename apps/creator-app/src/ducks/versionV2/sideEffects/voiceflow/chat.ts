import type * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as ProjectV2 from '@/ducks/projectV2';
import * as Tracking from '@/ducks/tracking';
import type { Thunk } from '@/store/types';

import { voice } from '../../selectors/active';
import { getActivePlatformVersionContext } from '../../utils';
import { platformFactory } from '../utils';

export const { patchSession, patchSettings, patchPublishing } = platformFactory<
  Platform.Voiceflow.Chat.Models.Version.Session,
  Platform.Voiceflow.Chat.Models.Version.Settings.Model,
  Platform.Voiceflow.Chat.Models.Version.Publishing.Model
>();

export const patchActiveAndLivePublishing =
  (
    publishing: Partial<Platform.Voiceflow.Chat.Models.Version.Publishing.Model>,
    { track }: { track?: boolean } = {}
  ): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const defaultVoice = voice.defaultVoiceSelector(state);
    const activeContext = getActivePlatformVersionContext(state);

    const actions: Promise<unknown>[] = [dispatch(patchPublishing(publishing))];

    const liveVersion = ProjectV2.active.liveVersionSelector(state);

    if (liveVersion) {
      actions.push(
        dispatch.sync(
          Realtime.version.patchPublishing({ ...activeContext, versionID: liveVersion, publishing, defaultVoice })
        )
      );
    }

    await Promise.all(actions);

    if (track) {
      Object.keys(publishing).forEach((element) => dispatch(Tracking.trackWebchatCustomization({ element })));
    }
  };
