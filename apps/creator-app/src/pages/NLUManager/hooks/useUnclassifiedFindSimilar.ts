import * as ML from '@voiceflow/ml-sdk';
import React from 'react';

import * as NLU from '@/ducks/nlu';
import * as Session from '@/ducks/session';
import { useMLGatewayClient, useSelector } from '@/hooks';
import { waitAsyncAction } from '@/utils/logux';

const useUnclassifiedFindSimilar = () => {
  const mlGatewayClient = useMLGatewayClient();
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const unclassifiedUtterances = useSelector(NLU.allUnclassifiedUtterancesSelector);
  const [similarityScores, setSimilarityScores] = React.useState(null as Record<string, number> | null);

  const findSimilarUtterances = async (targetPhrase: string): Promise<void> => {
    if (!activeVersionID) return;

    const { utterancesNewIntentsMap } = await waitAsyncAction(mlGatewayClient, ML.unclassified.findSimilar, {
      targetPhrase,
      utterances: unclassifiedUtterances.map((u) => u.utterance),
    });

    const scores = utterancesNewIntentsMap[targetPhrase];

    const similarUtterances = unclassifiedUtterances
      .filter(({ utterance }) => scores[utterance] && scores[utterance] > 0)
      .reduce((acc, utterance) => {
        const score = scores[utterance.utterance];
        return { ...acc, [utterance.id]: score ? Math.round(score * 100) : 0 };
      }, {} as Record<string, number>);

    setSimilarityScores(similarUtterances);
  };

  return { similarityScores, setSimilarityScores, findSimilarUtterances };
};

export default useUnclassifiedFindSimilar;
