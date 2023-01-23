import * as ML from '@voiceflow/ml-sdk';
import React from 'react';

import client from '@/client';
import * as NLU from '@/ducks/nlu';
import * as Session from '@/ducks/session';
import { useMLGatewayClient, useSelector } from '@/hooks';
import { waitAsyncAction } from '@/utils/logux';

const useUtteranceClustering = () => {
  const mlGatewayClient = useMLGatewayClient();
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const unclassifiedUtterances = useSelector(NLU.allUnclassifiedUtterancesSelector);
  const [clusteringData, setClusteringData] = React.useState<ML.unclassified.ClusteringData | null>(null);
  const [isClusteringDataLoading, setIsClusteringDataLoading] = React.useState(false);

  const clusterUtterances = async () => {
    if (!activeVersionID) return null;
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

      const utterancesIntentsMap = model.intents.reduce((utterancesMap, intent) => {
        return {
          ...utterancesMap,
          ...intent.inputs.reduce((inputs, input) => ({ ...inputs, [input.text]: intent.name }), {} as Record<string, string>),
        };
      }, unclassifiedUtterancesMap);

      const { utterancesNewIntentsMap } = await waitAsyncAction(mlGatewayClient, ML.unclassified.cluster, {
        utterancesIntentsMap,
      });

      setClusteringData(utterancesNewIntentsMap);

      return utterancesNewIntentsMap;
    } finally {
      setIsClusteringDataLoading(false);
    }
  };

  return { clusterUtterances, clusteringData, setClusteringData, isClusteringDataLoading };
};

export default useUtteranceClustering;
