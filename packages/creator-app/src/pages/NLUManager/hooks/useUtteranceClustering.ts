import * as ML from '@voiceflow/ml-sdk';
import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as NLU from '@/ducks/nlu';
import * as Session from '@/ducks/session';
import { useMLGatewayClient, useSelector } from '@/hooks';
import { waitAsyncAction } from '@/utils/logux';

const CACHE_TIMEOUT = 1000 * 60; // 1 minute

const useUtteranceClustering = () => {
  const mlGatewayClient = useMLGatewayClient();
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const unclassifiedUtterances = useSelector(NLU.allUnclassifiedUtterancesSelector);
  const [clusteringData, setClusteringData] = React.useState<ML.unclassified.ClusteringData | null>(null);
  const [isClusteringDataLoading, setIsClusteringDataLoading] = React.useState(false);
  const [lastFetchTime, setLastFetchTime] = React.useState(0);

  const clusterUtterances = async ({ noCache }: { noCache?: boolean } = {}) => {
    if (!activeVersionID) return null;

    if (clusteringData && !noCache && Date.now() - lastFetchTime < CACHE_TIMEOUT) return clusteringData;

    setIsClusteringDataLoading(true);

    try {
      const { model } = await client.nluManager.render(activeVersionID);

      const unclassifiedUtterancesMap = unclassifiedUtterances.reduce(
        (acc, utterance) => ({
          ...acc,
          [utterance.utterance]: '',
        }),
        {} as Record<string, string>
      );

      const utterancesIntentsMap = model.intents.reduce(
        (utterancesMap, intent) => ({
          ...utterancesMap,
          ...Object.fromEntries(intent.inputs.map((input) => [input.text, intent.name])),
        }),
        unclassifiedUtterancesMap
      );

      const { utterancesNewIntentsMap } = await waitAsyncAction(mlGatewayClient, ML.unclassified.cluster, {
        utterancesIntentsMap,
      });

      setLastFetchTime(Date.now());
      setClusteringData(utterancesNewIntentsMap);

      return utterancesNewIntentsMap;
    } finally {
      setIsClusteringDataLoading(false);
    }
  };

  // reset caching when unclassified utterances change
  useDidUpdateEffect(() => setLastFetchTime(0), [unclassifiedUtterances]);

  return { clusterUtterances, clusteringData, setLastFetchTime, setClusteringData, isClusteringDataLoading };
};

export default useUtteranceClustering;
