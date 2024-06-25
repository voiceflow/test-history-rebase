import type * as Platform from '@voiceflow/platform-config';

import type { Thunk } from '@/store/types';

import { platformFactory } from '../utils';

export const { patchSession, patchSettings, patchPublishing } = platformFactory<
  Platform.Common.Voice.Models.Version.Session,
  Platform.Common.Voice.Models.Version.Settings.Model,
  Platform.Common.Voice.Models.Version.Publishing.Model
>();

export const updateDefaultVoice =
  (defaultVoice: string): Thunk =>
  (dispatch) =>
    dispatch(patchSettings({ defaultVoice }, { defaultVoice }));
