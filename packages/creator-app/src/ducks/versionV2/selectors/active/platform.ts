import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
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
    case VoiceflowConstants.PlatformType.ALEXA:
      return alexa.localesSelector(rootState);
    case VoiceflowConstants.PlatformType.GOOGLE:
      return google.localesSelector(rootState);
    case VoiceflowConstants.PlatformType.DIALOGFLOW_ES:
      return dialogflow.localesSelector(rootState);
    default:
      return general.localesSelector(rootState);
  }
});

export const invocationNameSelector = createSelector([projectSelector, Utils.functional.identity], (activeProject, rootState) => {
  if (!activeProject) return null;

  switch (activeProject.platform) {
    case VoiceflowConstants.PlatformType.ALEXA:
      return alexa.invocationNameSelector(rootState);
    case VoiceflowConstants.PlatformType.GOOGLE:
      return google.invocationNameSelector(rootState);
    default:
      return general.invocationNameSelector(rootState);
  }
});

export const invocationsSelector = createSelector([projectSelector, Utils.functional.identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case VoiceflowConstants.PlatformType.ALEXA:
      return alexa.invocationsSelector(rootState);
    case VoiceflowConstants.PlatformType.GOOGLE:
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
