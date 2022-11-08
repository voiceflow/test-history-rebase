import { Config } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { BaseVersion } from '@voiceflow/base-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export type FromAndToDBOptions = [{ defaultVoice: string }];

const SHARED_FIELDS = Types.satisfies<keyof BaseVersion.Publishing>()(['selectedIntents']);

export const DEFAULT_VALUES: Pick<Models.Version.Publishing.Model, 'invocationName' | 'invocationNameSamples'> = {
  invocationName: '',
  invocationNameSamples: [],
};

export const smart = createSmartSimpleAdapter<BaseVersion.Publishing, Models.Version.Publishing.Model, FromAndToDBOptions, FromAndToDBOptions>(
  (dbPublishing) => Config.pickNonEmptyFields(dbPublishing, SHARED_FIELDS),
  (publishing) => Config.pickNonEmptyFields(publishing, SHARED_FIELDS)
);

export const simple = createSimpleAdapter<BaseVersion.Publishing, Models.Version.Publishing.Model, FromAndToDBOptions, FromAndToDBOptions>(
  (dbPublishing, options) => ({
    ...smart.fromDB(dbPublishing, options),
    ...DEFAULT_VALUES,
  }),
  (publishing, options) => smart.toDB(publishing, options)
);
