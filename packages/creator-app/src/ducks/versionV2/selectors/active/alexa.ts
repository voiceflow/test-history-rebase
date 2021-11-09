import { Constants, Version } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import { AlexaVersion } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<AlexaVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const modelSensitivitySelector = createSelector([settingsSelector], (settings) => settings?.modelSensitivity ?? null);

export const customInterfaceSelector = createSelector([settingsSelector], (settings) => settings?.customInterface ?? null);

export const eventsSelector = createSelector([settingsSelector], (settings) => settings?.events ?? null);

export const accountLinkingSelector = createSelector([settingsSelector], (settings) => settings?.accountLinking ?? null);

export const publishingSelector = createSelector([versionSelector], (version) => version?.publishing ?? null);

export const localesSelector = createSelector([publishingSelector], (publishing): Constants.Locale[] => publishing?.locales ?? []);

export const invocationNameSelector = createSelector([publishingSelector], (publishing) => publishing?.invocationName ?? null);

export const invocationsSelector = createSelector([publishingSelector], (publishing) => publishing?.invocations ?? []);

export const parentalControlSelector = createSelector(
  [publishingSelector, localesSelector],
  (publishing, locales) => publishing?.forChildren && locales.includes(Constants.Locale.EN_US)
);

export const isInReviewSelector = createSelector([versionSelector], (version) => version?.status?.stage === Version.AlexaStage.REVIEW);
