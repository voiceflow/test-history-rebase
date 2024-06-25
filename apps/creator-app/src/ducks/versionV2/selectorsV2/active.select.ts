import { DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import { activeVersionIDSelector } from '@/ducks/session';

import { getVersionByIDSelector } from '../selectors/base';

export const root = createSelector([activeVersionIDSelector, getVersionByIDSelector], (versionID, getVersion) =>
  getVersion({ id: versionID })
);

export const settings = createSelector([root], (version) => version?.settingsV2);

export const intentClassificationSettings = createSelector(
  [settings],
  (settings) => settings?.intentClassification ?? DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS
);

export const intentClassificationSettingsType = createSelector(
  [intentClassificationSettings],
  (settings) => settings.type
);
