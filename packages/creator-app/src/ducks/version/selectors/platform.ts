import { PlatformType } from '@voiceflow/internal';
import { createSelector } from 'reselect';

import * as Feature from '@/ducks/feature';
import * as Project from '@/ducks/project';
import { identity } from '@/utils/functional';
import { getSlotTypes } from '@/utils/slot';

import * as alexa from '../platform/alexa';
import * as general from '../platform/general';
import * as google from '../platform/google';

// active version

export const activeLocalesSelector = createSelector([Project.activeProjectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case PlatformType.ALEXA:
      return alexa.activeLocalesSelector(rootState);
    case PlatformType.GOOGLE:
      return google.activeLocalesSelector(rootState);
    case PlatformType.GENERAL:
    default:
      return general.activeLocalesSelector(rootState);
  }
});

export const activeInvocationNameSelector = createSelector([Project.activeProjectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return null;

  switch (activeProject.platform) {
    case PlatformType.ALEXA:
      return alexa.activeInvocationNameSelector(rootState);
    case PlatformType.GOOGLE:
      return google.activeInvocationNameSelector(rootState);
    case PlatformType.GENERAL:
    default:
      return general.activeInvocationNameSelector(rootState);
  }
});

export const activeInvocationsSelector = createSelector([Project.activeProjectSelector, identity], (activeProject, rootState) => {
  if (!activeProject) return [];

  switch (activeProject.platform) {
    case PlatformType.ALEXA:
      return alexa.activeInvocationsSelector(rootState);
    case PlatformType.GOOGLE:
      return google.activeInvocationsSelector(rootState);
    case PlatformType.GENERAL:
    default:
      return [];
  }
});

export const activeSlotTypesSelector = createSelector(
  [activeLocalesSelector, Project.activePlatformSelector, Feature.isFeatureEnabledSelector],
  (locales, platform, isFeatureEnabled) => getSlotTypes({ locales: locales as string[], platform }, isFeatureEnabled)
);
