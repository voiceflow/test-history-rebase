import { Constants } from '@voiceflow/google-dfes-types';
import { DialogflowVersion } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { Nullable } from '@/types';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<DialogflowVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const publishingSelector = createSelector([versionSelector], (version) => version?.publishing ?? null);

export const localesSelector = createSelector([publishingSelector], (publishing): Constants.Locale[] => publishing?.locales ?? []);

export const triggerPhraseSelector = createSelector([publishingSelector], (publishing) => publishing?.triggerPhrase ?? []);

export const invocationNameSelector = createSelector([publishingSelector], (publishing) => publishing?.pronunciation ?? null);

export const invocationsSelector = createSelector([publishingSelector], (publishing) => publishing?.sampleInvocations ?? []);
