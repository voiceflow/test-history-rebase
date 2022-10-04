import { NluUnclassifiedData } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

export const nluUnclassifiedDataAdapter = createMultiAdapter<BaseModels.Version.NLUUnclassifiedData, NluUnclassifiedData>(
  ({ id, name, type, utterances, creatorID }) => ({ id, name, type, utterances, creatorID }),
  ({ id, name, type, utterances, creatorID }) => ({ id, name, type, utterances, creatorID })
);
