import { Utils } from '@voiceflow/common';
import * as ML from '@voiceflow/ml-sdk';

import { AbstractActionControl } from '@/actions/utils';
import { BasePubSubPayload } from '@/models';

interface PubSubRequest extends ML.intent.ClarityModelPayload, BasePubSubPayload {}

interface PubSubResponse extends ML.intent.ClarityModelResponse, BasePubSubPayload {}

class ClarityModel extends AbstractActionControl<ML.intent.ClarityModelPayload> {
  static MODEL_ID = 'nlumanage-pairwise';

  actionCreator = ML.intent.clarityModel.started;

  // TODO: implement access method to clarity model
  access = async () => true;

  process = this.reply(ML.intent.clarityModel, async (ctx, action) => {
    const { intents, slots, platform, topConflicting } = action.payload;
    const config = await this.services.configuration.getConfiguration(ClarityModel.MODEL_ID);

    const { clarityByClass, overallScores, problematicSentences, utteranceMapper } = await this.services.interaction.sendRequest<
      PubSubRequest,
      PubSubResponse
    >(`${ctx.userId}.${Utils.id.cuid.slug()}`, config, {
      reqGUID: Utils.id.cuid(),
      // the order of the fields is important here!
      intents,
      platform,
      slots,
      topConflicting,
    });

    return { clarityByClass, overallScores, problematicSentences, utteranceMapper };
  });
}

export default ClarityModel;
