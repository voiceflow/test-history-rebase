import { AlexaVersion } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { getActivePlatformVersionContext } from '../utils';

// action creators

// side effects

export const patchSettings =
  (settings: Partial<AlexaVersion.Settings>): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.patchSettings({ ...getActivePlatformVersionContext(getState()), settings }));
  };

export const patchPublishing =
  (publishing: Partial<AlexaVersion.Publishing>): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.patchPublishing({ ...getActivePlatformVersionContext(getState()), publishing }));
  };

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
