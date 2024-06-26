import type { BaseModels } from '@voiceflow/base-types';
import type { KnowledgeBaseSettings } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { notify } from '@voiceflow/ui-next';

import { designerClient } from '@/client/designer';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import * as Errors from '@/config/errors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { DEFAULT_SETTINGS } from '@/ModalsV2/modals/KnowledgeBase/KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import type { Thunk } from '@/store/types';

import * as Actions from './knowledge-base.action';

const ERROR_MESSAGE = 'Unable to save Knowledge Base settings';

export const getSettings = (): Thunk<BaseModels.Project.KnowledgeBaseSettings> => async (dispatch, getState) => {
  const state = getState();

  let settings: BaseModels.Project.KnowledgeBaseSettings;

  if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertProjectID(versionID);

    settings = (await designerClient.knowledgeBase.version.settings.getOne(
      versionID
    )) as BaseModels.Project.KnowledgeBaseSettings;
  } else {
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    settings = (await designerClient.knowledgeBase.settings.getOne(
      projectID
    )) as BaseModels.Project.KnowledgeBaseSettings;
  }

  if (settings.summarization.model && !Object.keys(AI_MODEL_CONFIG_MAP).includes(settings.summarization.model)) {
    settings = {
      ...settings,
      summarization: { ...settings.summarization, model: DEFAULT_SETTINGS.summarization.model },
    };
    patchSettings(settings);
  }

  dispatch(Actions.SetSettings({ settings }));

  return settings;
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

      await designerClient.knowledgeBase.version.settings
        .updateOne(versionID, patch as KnowledgeBaseSettings)
        .catch(() => notify.short.error(ERROR_MESSAGE));
    } else {
      const projectID = Session.activeProjectIDSelector(state);

      Errors.assertProjectID(projectID);

      await designerClient.knowledgeBase.settings
        .updateOne(projectID, patch as KnowledgeBaseSettings)
        .catch(() => notify.short.error(ERROR_MESSAGE));
    }

    dispatch(Actions.PatchSettings({ patch }));
  };
