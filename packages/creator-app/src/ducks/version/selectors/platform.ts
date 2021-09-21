import { Constants } from '@voiceflow/general-types';
import { createSelector } from 'reselect';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import { identity } from '@/utils/functional';
import { getSlotTypes } from '@/utils/slot';

import * as alexa from '../platform/alexa';
import * as general from '../platform/general';
import * as google from '../platform/google';

// active version

export const activeLocalesSelector = createSelector([ProjectV2.active.projectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case Constants.PlatformType.ALEXA:
      return alexa.activeLocalesSelector(rootState);
    case Constants.PlatformType.GOOGLE:
      return google.activeLocalesSelector(rootState);
    case Constants.PlatformType.GENERAL:
    default:
      return general.activeLocalesSelector(rootState);
  }
});

export const activeInvocationNameSelector = createSelector([ProjectV2.active.projectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return null;

  switch (activeProject.platform) {
    case Constants.PlatformType.ALEXA:
      return alexa.activeInvocationNameSelector(rootState);
    case Constants.PlatformType.GOOGLE:
      return google.activeInvocationNameSelector(rootState);
    case Constants.PlatformType.GENERAL:
    default:
      return general.activeInvocationNameSelector(rootState);
  }
});

export const activeInvocationsSelector = createSelector([ProjectV2.active.projectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case Constants.PlatformType.ALEXA:
      return alexa.activeInvocationsSelector(rootState);
    case Constants.PlatformType.GOOGLE:
      return google.activeInvocationsSelector(rootState);
    case Constants.PlatformType.GENERAL:
    default:
      return [];
  }
});

export const activeSlotTypesSelector = createSelector(
  [activeLocalesSelector, ProjectV2.active.platformSelector, Feature.isFeatureEnabledSelector],
  (locales, platform, isFeatureEnabled) =>
    getSlotTypes({ locales: locales as string[], platform, natoEnabled: !!isFeatureEnabled(FeatureFlag.NATO_APCO) })
);
