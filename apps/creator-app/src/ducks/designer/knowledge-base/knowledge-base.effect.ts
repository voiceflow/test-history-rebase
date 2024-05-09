import { BaseModels } from '@voiceflow/base-types';
import { KnowledgeBaseSettings } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { notify } from '@voiceflow/ui-next';

import api from '@/client/api';
import { designerClient } from '@/client/designer';
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

  const kbRealtimeSettingsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_REALTIME_SETTINGS);

  if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertProjectID(versionID);

    if (kbRealtimeSettingsEnabled) {
      settings = (await designerClient.knowledgeBase.version.getSettings(versionID)) as BaseModels.Project.KnowledgeBaseSettings;
    } else {
      ({ data: settings } = await api.fetch
        .get<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`)
        .catch(() => {
          return { data: {} as BaseModels.Project.KnowledgeBaseSettings };
        }));
    }
  } else {
    const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  if (kbRealtimeSettingsEnabled) {
    settings = (await designerClient.knowledgeBase.settings.getSettings(projectID)) as BaseModels.Project.KnowledgeBaseSettings;
  } else {
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

    const kbRealtimeSettingsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_REALTIME_SETTINGS);

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
      const versionID = Session.activeVersionIDSelector(state);

      Errors.assertProjectID(versionID);

      await api.fetch.patch<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`, patch).catch(() => {
        notify.short.error('Unable to save Knowledge Base settings');
      });
    } else {
      const projectID = Session.activeProjectIDSelector(state);

      Errors.assertProjectID(projectID);

      if (kbRealtimeSettingsEnabled) {
        await designerClient.knowledgeBase.settings.updateSettings(projectID, patch as KnowledgeBaseSettings);
      } else {
        await knowledgeBaseClient.patchSettings(projectID, patch);
      }
    }

    dispatch(Actions.PatchSettings({ patch }));
  };
