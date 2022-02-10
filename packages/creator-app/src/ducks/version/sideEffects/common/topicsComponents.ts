import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';

import { crud } from '../../actions';
import { getActiveVersionContext } from '../../utils';

/**
 * @deprecated syncing topics will be done automatically by the new realtime system
 */
export const saveTopics =
  (topics: BaseModels.Version.FolderItem[]): Thunk =>
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
  (components: BaseModels.Version.FolderItem[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    Errors.assertVersionID(versionID);

    dispatch(crud.patch(versionID, { components }));
    await client.api.version.update(versionID, { components });
  };

export const reorderTopics =
  (from: number, to: number): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const state = getState();
          const topics = VersionV2.active.topicsSelector(state);

          dispatch(saveTopics(Utils.array.reorder(topics, from, to)));
        },
        async (context) => {
          await dispatch.sync(Realtime.version.reorderTopics({ ...context, from, to }));
        }
      )
    );

export const reorderComponents =
  (from: number, to: number): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const state = getState();
          const components = VersionV2.active.componentsSelector(state);

          dispatch(saveComponents(Utils.array.reorder(components, from, to)));
        },
        async (context) => {
          await dispatch.sync(Realtime.version.reorderComponents({ ...context, from, to }));
        }
      )
    );
