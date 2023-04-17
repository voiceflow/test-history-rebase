import * as ML from '@voiceflow/ml-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import { UnclassifiedDataCluster } from './types';

export const formatImportedAt = (date: string | Date) => dayjs(date.toString()).fromNow();

export const formatImportedAtDate = (date: string | Date) => dayjs(date.toString()).format('MMM Do');

export const mapClusteringData = (
  clusteringData: ML.unclassified.ClusteringData,
  unclassifiedUtterances: Realtime.NLUUnclassifiedUtterances[]
): { clusters: UnclassifiedDataCluster[]; clusteredUtterances: Record<string, string> } => {
  const utterances = Object.keys(clusteringData);
  let clustersMapper: Record<string, UnclassifiedDataCluster> = {};
  const clusteredUtterances: Record<string, string> = {};

  for (let i = 0; i < utterances.length; i++) {
    const utterance = utterances[i];
    const clusterModel = clusteringData[utterance];

    const intents = Object.entries(clusterModel).map(([intent, score]) => ({ intent, score }));

    const matchedIntent = sortBy(intents, ['score']).reverse()[0];
    const unclassifiedUtterance = unclassifiedUtterances.find((u) => u.utterance === utterance);

    if (unclassifiedUtterance) {
      const intentCluster = clustersMapper[matchedIntent.intent];

      clustersMapper = {
        ...clustersMapper,
        [matchedIntent.intent]: {
          id: matchedIntent.intent,
          name: intentCluster ? intentCluster.name : unclassifiedUtterance.utterance,
          utteranceIDs: intentCluster ? [...intentCluster.utteranceIDs, unclassifiedUtterance.id] : [unclassifiedUtterance.id],
        },
      };

      clusteredUtterances[unclassifiedUtterance.id] = matchedIntent.intent;
    }
  }

  return { clusters: Object.values(clustersMapper), clusteredUtterances };
};
