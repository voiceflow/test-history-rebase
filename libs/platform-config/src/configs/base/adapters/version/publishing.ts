import type { BaseVersion } from '@voiceflow/base-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import { Config as ConfigUtils } from '@/configs/utils';
import { Types } from '@/utils';

import type * as Models from '../../models';

export type FromAndToDBOptions = [{ defaultVoice: string }];

const SHARED_FIELDS = Types.satisfies<keyof BaseVersion.Publishing>()(['selectedIntents']);

const DEFAULT_VALUES: Pick<Models.Version.Publishing.Model, 'locales' | 'invocationName' | 'invocationNameSamples'> = {
  locales: [],
  invocationName: '',
  invocationNameSamples: [],
};

export const smart = createSmartSimpleAdapter<
  BaseVersion.Publishing,
  Pick<Models.Version.Publishing.Model, keyof BaseVersion.Publishing>,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  (dbPublishing) => ConfigUtils.pickNonEmptyFields(dbPublishing, SHARED_FIELDS),
  (publishing) => ConfigUtils.pickNonEmptyFields(publishing, SHARED_FIELDS)
);

export const simple = createSimpleAdapter<
  BaseVersion.Publishing,
  Models.Version.Publishing.Model,
  FromAndToDBOptions,
  FromAndToDBOptions
>(
  (dbPublishing, options) => ({
    ...smart.fromDB(dbPublishing, options),
    ...DEFAULT_VALUES,
  }),
  (publishing, options) => smart.toDB(publishing, options)
);

export const CONFIG = {
  smart,
  simple,
};

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
