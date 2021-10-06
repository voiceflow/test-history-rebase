import { VersionFolderItem } from '@voiceflow/api-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { patchVersion } from '../../actions';

export const saveTopics =
  (topics: VersionFolderItem[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(patchVersion(versionID, { topics }));
    await client.api.version.update(versionID, { topics });
  };

export const saveComponents =
  (components: VersionFolderItem[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(patchVersion(versionID, { components }));
    await client.api.version.update(versionID, { components });
  };
