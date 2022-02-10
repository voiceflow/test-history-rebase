import { Nullable } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<Realtime.DialogflowVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const publishingSelector = createSelector([versionSelector], (version) => version?.publishing ?? null);

export const localesSelector = createSelector([publishingSelector], (publishing): DFESConstants.Locale[] => publishing?.locales ?? []);

export const triggerPhraseSelector = createSelector([publishingSelector], (publishing) => publishing?.triggerPhrase ?? []);

export const agentNameSelector = createSelector([publishingSelector], (publishing) => publishing?.agentName ?? null);

export const invocationNameSelector = createSelector([publishingSelector], (publishing) => publishing?.pronunciation ?? null);

export const invocationsSelector = createSelector([publishingSelector], (publishing) => publishing?.sampleInvocations ?? []);
