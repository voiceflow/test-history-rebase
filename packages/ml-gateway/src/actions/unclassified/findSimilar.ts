import { Utils } from '@voiceflow/common';
import * as ML from '@voiceflow/ml-sdk';

import { AbstractActionControl } from '@/actions/utils';
import { BasePubSubPayload } from '@/models';

interface PubSubRequest extends BasePubSubPayload {
  nWords: number;
  similarityScoring: boolean;
  topK: number;
  useSeed: boolean;
  utterancesIntentsMap: Record<string, Record<string, number>>;
}

interface PubSubResponse extends ML.unclassified.FindSimilarResponsePayload, BasePubSubPayload {}

const FIND_SIMILAR_REQUEST_CONFIG = {
  nWords: 3,
  similarityScoring: true,
  useSeed: false,
  topK: 10,
};

const APPEND_REQUEST_CONFIG = false;

class FindSimilar extends AbstractActionControl<ML.unclassified.FindSimilarRequestPayload> {
  static MODEL_ID = 'clusterer-utterances';

  actionCreator = ML.unclassified.findSimilar.started;

  // TODO: implement
  access = async () => true;

  process = this.reply(ML.unclassified.findSimilar, async (ctx, action) => {
    const { utterances, targetPhrase } = action.payload;

    const config = await this.services.configuration.getConfiguration(FindSimilar.MODEL_ID);

    const { utterancesNewIntentsMap } = await this.services.interaction.sendRequest<PubSubRequest, PubSubResponse>(
      `${ctx.userId}.${Utils.id.cuid.slug()}`,
      config,
      {
        reqGUID: Utils.id.cuid(),
        // the order of the fields is important here!
        nWords: FIND_SIMILAR_REQUEST_CONFIG.nWords,
        similarityScoring: FIND_SIMILAR_REQUEST_CONFIG.similarityScoring,
        topK: FIND_SIMILAR_REQUEST_CONFIG.topK,
        useSeed: FIND_SIMILAR_REQUEST_CONFIG.useSeed,
        utterancesIntentsMap: utterances.reduce((acc, utterance) => {
          return {
            ...acc,
            [utterance]: utterance === targetPhrase ? 'this' : '',
          };
        }, {}),
      },
      this.services.interaction.DEFAULT_REQUEST_TIMEOUT,
      APPEND_REQUEST_CONFIG
    );

    return { utterancesNewIntentsMap };
  });
}

export default FindSimilar;
