import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as Feature from '@/ducks/feature';
import { platformSelector, projectSelector } from '@/ducks/projectV2/selectors/active';
import { getSlotTypes } from '@/utils/slot';

import * as alexa from './alexa';
import * as dialogflow from './dialogflow';
import * as general from './general';
import * as google from './google';

export const localesSelector = createSelector([projectSelector, Utils.functional.identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case Platform.Constants.PlatformType.ALEXA:
      return alexa.localesSelector(rootState);
    case Platform.Constants.PlatformType.GOOGLE:
      return google.localesSelector(rootState);
    case Platform.Constants.PlatformType.DIALOGFLOW_ES:
      return dialogflow.localesSelector(rootState);
    default:
      return general.localesSelector(rootState);
  }
});

export const invocationNameSelector = createSelector([projectSelector, Utils.functional.identity], (activeProject, rootState) => {
  if (!activeProject) return null;

  switch (activeProject.platform) {
    case Platform.Constants.PlatformType.ALEXA:
      return alexa.invocationNameSelector(rootState);
    case Platform.Constants.PlatformType.GOOGLE:
      return google.invocationNameSelector(rootState);
    default:
      return general.invocationNameSelector(rootState);
  }
});

export const invocationsSelector = createSelector([projectSelector, Utils.functional.identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case Platform.Constants.PlatformType.ALEXA:
      return alexa.invocationsSelector(rootState);
    case Platform.Constants.PlatformType.GOOGLE:
      return google.invocationsSelector(rootState);
    default:
      return [];
  }
});

export const slotTypesSelector = createSelector(
  [localesSelector, platformSelector, Feature.isFeatureEnabledSelector],
  (locales, platform, isFeatureEnabled) =>
    getSlotTypes({ locales: locales as string[], platform, natoEnabled: !!isFeatureEnabled(Realtime.FeatureFlag.NATO_APCO) })
);

export const slotTypesMapSelector = createSelector([slotTypesSelector], (slotTypes) =>
  Utils.array.createMap(slotTypes, (slotType) => slotType.value)
);
