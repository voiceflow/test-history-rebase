import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui-next';

import { knowledgeBaseClient } from '@/client/knowledge-base';
import * as Errors from '@/config/errors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import type { Thunk } from '@/store/types';

import * as Actions from './knowledge-base.action';

export const getSettings = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  let settings: BaseModels.Project.KnowledgeBaseSettings;

  if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertProjectID(versionID);

    settings = await knowledgeBaseClient.getVersionSettings(versionID);
  } else {
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    settings = await knowledgeBaseClient.getSettings(projectID);
  }

  dispatch(Actions.SetSettings({ settings }));
};

export const loadSettings = (): Thunk => async (dispatch) => {
  try {
    await dispatch(getSettings());
  } catch {
    toast.error('Unable to fetch Knowledge Base settings');
  }
};

export const patchSettings =
  (patch: Partial<BaseModels.Project.KnowledgeBaseSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
      const versionID = Session.activeVersionIDSelector(state);

      Errors.assertProjectID(versionID);

      await knowledgeBaseClient.patchVersionSettings(versionID, patch);
    } else {
      const projectID = Session.activeProjectIDSelector(state);

      Errors.assertProjectID(projectID);

      await knowledgeBaseClient.patchSettings(projectID, patch);
    }

    dispatch(Actions.PatchSettings({ patch }));
  };
