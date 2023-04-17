import { AlexaVersion } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { platformFactory } from './utils';

// side effects

export const { patchSession, patchSettings, patchPublishing } = platformFactory<
  Platform.Alexa.Voice.Models.Version.Session,
  Platform.Alexa.Voice.Models.Version.Settings.Model,
  Platform.Alexa.Voice.Models.Version.Publishing.Model
>();

export const loadAccountLinking = (): Thunk<Nullable<AlexaVersion.AccountLinking>> => async (_dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  const {
    platformData: {
      settings: { accountLinking },
    },
  } = await client.api.version.get<{ platformData: AlexaVersion.PlatformData }>(versionID, ['platformData']);

  return accountLinking;
};
