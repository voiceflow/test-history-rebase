import { Constants } from '@voiceflow/general-types';
import { createSelector } from 'reselect';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import { identity } from '@/utils/functional';
import { getSlotTypes } from '@/utils/slot';

import * as alexa from './alexa';
import * as dialogflow from './dialogflow';
import * as general from './general';
import * as google from './google';

export const localesSelector = createSelector([ProjectV2.active.projectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case Constants.PlatformType.ALEXA:
      return alexa.localesSelector(rootState);
    case Constants.PlatformType.GOOGLE:
      return google.localesSelector(rootState);
    case Constants.PlatformType.DIALOGFLOW_ES_CHAT:
    case Constants.PlatformType.DIALOGFLOW_ES_VOICE:
      return dialogflow.localesSelector(rootState);
    case Constants.PlatformType.GENERAL:
    default:
      return general.localesSelector(rootState);
  }
});

export const invocationNameSelector = createSelector([ProjectV2.active.projectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return null;

  switch (activeProject.platform) {
    case Constants.PlatformType.ALEXA:
      return alexa.invocationNameSelector(rootState);
    case Constants.PlatformType.GOOGLE:
      return google.invocationNameSelector(rootState);
    case Constants.PlatformType.GENERAL:
    default:
      return general.invocationNameSelector(rootState);
  }
});

export const invocationsSelector = createSelector([ProjectV2.active.projectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case Constants.PlatformType.ALEXA:
      return alexa.invocationsSelector(rootState);
    case Constants.PlatformType.GOOGLE:
      return google.invocationsSelector(rootState);
    case Constants.PlatformType.GENERAL:
    default:
      return [];
  }
});

export const slotTypesSelector = createSelector(
  [localesSelector, ProjectV2.active.platformSelector, Feature.isFeatureEnabledSelector],
  (locales, platform, isFeatureEnabled) =>
    getSlotTypes({ locales: locales as string[], platform, natoEnabled: !!isFeatureEnabled(FeatureFlag.NATO_APCO) })
);
