import * as ML from '@voiceflow/ml-sdk';

import { AbstractActionControl } from '@/actions/utils';

class SuggestUtterance extends AbstractActionControl<ML.utterance.SuggestUtterancesPayload> {
  actionCreator = ML.utterance.suggest.started;

  access = async () => {
    // TODO: implement
    return false;
  };

  process = this.reply(ML.utterance.suggest, async (_ctx, _action) => {
    return [];
  });
}

export default SuggestUtterance;
