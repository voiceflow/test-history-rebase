import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<Realtime.GoogleVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const publishingSelector = createSelector([versionSelector], (version) => version?.publishing ?? null);

export const localesSelector = createSelector([publishingSelector], (publishing) => publishing?.locales ?? []);

export const invocationNameSelector = createSelector([publishingSelector], (publishing) => publishing?.pronunciation ?? null);

export const invocationsSelector = createSelector([publishingSelector], (publishing) => publishing?.sampleInvocations ?? []);
