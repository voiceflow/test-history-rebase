import { AlexaConstants, AlexaVersion } from '@voiceflow/alexa-types';
import * as Platform from '@voiceflow/platform-config';
import { createSelector } from 'reselect';

import { localesSelector } from './base';
import { platformSelectorsFactory } from './utils';

export const { versionSelector, sessionSelector, settingsSelector, publishingSelector } =
  platformSelectorsFactory<Platform.Alexa.Voice.Models.Version.Model>();

export const eventsSelector = createSelector([settingsSelector], (settings) => settings?.events ?? null);

export const isInReviewSelector = createSelector([versionSelector], (version) => version?.status?.stage === AlexaVersion.Stage.REVIEW);

export const customInterfaceSelector = createSelector([settingsSelector], (settings) => settings?.customInterface ?? null);

export const parentalControlSelector = createSelector(
  [publishingSelector, localesSelector],
  (publishing, locales) => publishing?.forChildren && locales.includes(AlexaConstants.Locale.EN_US)
);

export const modelSensitivitySelector = createSelector([settingsSelector], (settings) => settings?.modelSensitivity ?? null);
