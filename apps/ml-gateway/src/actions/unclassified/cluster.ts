import { Utils } from '@voiceflow/common';
import * as ML from '@voiceflow/ml-sdk';

import { AbstractActionControl } from '@/actions/utils';
import { BasePubSubPayload } from '@/models';

interface PubSubRequest extends ML.unclassified.ClusterRequestPayload, BasePubSubPayload {
  nWords: number;
  similarityScoring: boolean;
  topK: number;
  useSeed: boolean;
}

interface PubSubResponse extends ML.unclassified.ClusterResponsePayload, BasePubSubPayload {}

const CLUSTER_REQUEST_CONFIG = {
  nWords: 3,
  similarityScoring: false,
  topK: 3,
  useSeed: true,
};

const APPEND_REQUEST_CONFIG = false;

class Cluster extends AbstractActionControl<ML.unclassified.ClusterRequestPayload> {
  static MODEL_ID = 'clusterer-utterances';

  actionCreator = ML.unclassified.cluster.started;

  // TODO: implement
  access = async () => true;

  process = this.reply(ML.unclassified.cluster, async (ctx, action) => {
    const { utterancesIntentsMap } = action.payload;

    const config = await this.services.configuration.getConfiguration(Cluster.MODEL_ID);

    const { utterancesNewIntentsMap } = await this.services.interaction.sendRequest<PubSubRequest, PubSubResponse>(
      `${ctx.userId}.${Utils.id.cuid.slug()}`,
      config,
      {
        reqGUID: Utils.id.cuid(),
        // the order of the fields is important here!
        nWords: CLUSTER_REQUEST_CONFIG.nWords,
        similarityScoring: CLUSTER_REQUEST_CONFIG.similarityScoring,
        topK: CLUSTER_REQUEST_CONFIG.topK,
        useSeed: CLUSTER_REQUEST_CONFIG.useSeed,
        utterancesIntentsMap,
      },
      this.services.interaction.DEFAULT_REQUEST_TIMEOUT,
      APPEND_REQUEST_CONFIG
    );

    return { utterancesNewIntentsMap };
  });
}

export default Cluster;
