import { Config as ConfigUtils } from '@platform-config/configs/utils';
import type { BaseVersion } from '@voiceflow/base-types';
import type { VersionSettings } from '@voiceflow/dtos';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';
import * as Publishing from './publishing';
import * as Session from './session';
import * as Settings from './settings';

export { Publishing, Session, Settings };

export type FromDBOptions = [{ defaultVoice: string }];
export type DBVersion<V extends BaseVersion.Version<any>> = Pick<
  V,
  '_id' | 'platformData' | Models.Version.ModelDBSharedFields
> & {
  settings?: VersionSettings;
};

/**
 * filters out default global variables
 */
export const simple = createMultiAdapter<DBVersion<BaseVersion.Version>, Models.Version.Model, FromDBOptions>(
  ({
    _id,
    settings,
    _version,
    creatorID,
    projectID,
    platformData,
    rootDiagramID,
    defaultStepColors = {},
    templateDiagramID,
  }) => ({
    id: _id,
    status: null,
    session: Session.simple.fromDB(platformData.settings.session, { defaultVoice: '' }),
    _version,
    settings: Settings.simple.fromDB(platformData.settings, { defaultVoice: '' }),
    creatorID,
    projectID,
    settingsV2: settings,
    publishing: Publishing.simple.fromDB(platformData.publishing, { defaultVoice: '' }),
    rootDiagramID,
    templateDiagramID,
    defaultStepColors,
  }),
  notImplementedAdapter.transformer
);

export const CONFIG = {
  simple,

  session: Session.CONFIG,

  settings: Settings.CONFIG,

  publishing: Publishing.CONFIG,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
