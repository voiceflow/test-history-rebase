import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as ProjectV2 from '@/ducks/projectV2';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<Realtime.GeneralVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const localesSelector = createSelector([settingsSelector], (settings) => settings?.locales ?? []);

export const invocationNameSelector = ProjectV2.active.nameSelector;
