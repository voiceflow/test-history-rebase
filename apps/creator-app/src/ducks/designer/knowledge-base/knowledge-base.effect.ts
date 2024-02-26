import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { notify } from '@voiceflow/ui-next';

import api from '@/client/api';
import { knowledgeBaseClient } from '@/client/knowledge-base';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import * as Errors from '@/config/errors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { DEFAULT_SETTINGS } from '@/ModalsV2/modals/KnowledgeBase/KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import type { Thunk } from '@/store/types';

import * as Actions from './knowledge-base.action';

export const getSettings = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  let settings: BaseModels.Project.KnowledgeBaseSettings;

  if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertProjectID(versionID);

    ({ data: settings } = await api.fetch
      .get<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`)
      .catch(() => {
        return { data: {} as BaseModels.Project.KnowledgeBaseSettings };
      }));
  } else {
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    settings = await knowledgeBaseClient.getSettings(projectID);
  }

  if (settings.summarization.model && !Object.keys(AI_MODEL_CONFIG_MAP).includes(settings.summarization.model)) {
    settings = { ...settings, summarization: { ...settings.summarization, model: DEFAULT_SETTINGS.summarization.model } };
    patchSettings(settings);
  }

  dispatch(Actions.SetSettings({ settings }));
};

export const loadSettings = (): Thunk => async (dispatch) => {
  await dispatch(getSettings());
};

export const patchSettings =
  (patch: Partial<BaseModels.Project.KnowledgeBaseSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
      const versionID = Session.activeVersionIDSelector(state);

      Errors.assertProjectID(versionID);

      await api.fetch.patch<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`, patch).catch(() => {
        notify.short.error('Unable to save Knowledge Base settings');
      });
    } else {
      const projectID = Session.activeProjectIDSelector(state);

      Errors.assertProjectID(projectID);

      await knowledgeBaseClient.patchSettings(projectID, patch);
    }

    dispatch(Actions.PatchSettings({ patch }));
  };
