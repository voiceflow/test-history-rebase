import { Utils } from '@voiceflow/common';
import * as ML from '@voiceflow/ml-sdk';

import { AbstractActionControl } from '@/actions/utils';
import { BasePubSubPayload } from '@/models';

interface PubSubRequest extends BasePubSubPayload {
  utterance: string;
  numberOfUtterances: number;
}

interface PubSubResponse extends BasePubSubPayload {
  utterances: string[];
}

class Suggest extends AbstractActionControl<ML.utterance.SuggestPayload> {
  static MODEL_ID = 'utterances-twivfm';

  actionCreator = ML.utterance.suggest.started;

  // TODO: implement
  access = async () => true;

  process = this.reply(ML.utterance.suggest, async (ctx, action) => {
    const { utterance, numberOfUtterances } = action.payload;

    const config = await this.services.configuration.getConfiguration(Suggest.MODEL_ID);

    const { utterances } = await this.services.interaction.sendRequest<PubSubRequest, PubSubResponse>(
      `${ctx.userId}.${Utils.id.cuid.slug()}`,
      config,
      {
        reqGUID: Utils.id.cuid(),

        // the order of the fields is important here!
        numberOfUtterances,
        utterance,
      }
    );

    return utterances;
  });
}

export default Suggest;
