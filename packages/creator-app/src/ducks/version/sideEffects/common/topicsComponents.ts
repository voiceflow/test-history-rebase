import { VersionFolderItem } from '@voiceflow/api-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { crud } from '../../actions';

/**
 * @deprecated syncing topics will be done automatically by the new realtime system
 */
export const saveTopics =
  (topics: VersionFolderItem[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    Errors.assertVersionID(versionID);

    dispatch(crud.patch(versionID, { topics }));
    await client.api.version.update(versionID, { topics });
  };

/**
 * @deprecated syncing components will be done automatically by the new realtime system
 */
export const saveComponents =
  (components: VersionFolderItem[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    Errors.assertVersionID(versionID);

    dispatch(crud.patch(versionID, { components }));
    await client.api.version.update(versionID, { components });
  };
