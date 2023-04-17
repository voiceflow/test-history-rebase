import { NLUUnclassifiedData } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter } from 'bidirectional-adapter';

export const nluUnclassifiedDataAdapter = createMultiAdapter<BaseModels.Version.NLUUnclassifiedData, NLUUnclassifiedData>(
  ({ key = Utils.id.cuid(), name, type, utterances, creatorID, importedAt }) => ({
    id: key,
    name,
    type,
    utterances: utterances.map((u) => ({
      ...u,
      id: u.id || Utils.id.cuid(),
      importedAt: importedAt ? new Date(importedAt) : new Date(),
      datasourceID: key,
      datasourceName: name,
    })),
    creatorID,
    importedAt,
  }),
  ({ id, name, type, utterances, creatorID }) => ({
    key: id,
    name,
    type,
    utterances: utterances.map((u) => ({ id: u.id, utterance: u.utterance, sourceID: u.sourceID })),
    creatorID,
  })
);
