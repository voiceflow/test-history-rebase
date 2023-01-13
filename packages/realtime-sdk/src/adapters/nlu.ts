import { NluUnclassifiedData } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter } from 'bidirectional-adapter';

export const nluUnclassifiedDataAdapter = createMultiAdapter<BaseModels.Version.NLUUnclassifiedData, NluUnclassifiedData>(
  ({ key, name, type, utterances, creatorID }) => ({
    id: key ?? Utils.id.cuid(),
    name,
    type,
    utterances: utterances.map((u) => ({ id: Utils.generate.id(), ...u })),
    creatorID,
  }),
  ({ id, name, type, utterances, creatorID }) => ({ key: id, name, type, utterances: utterances.map(({ id: _, ...u }) => u), creatorID })
);
