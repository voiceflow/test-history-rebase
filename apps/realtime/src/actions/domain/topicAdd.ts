import * as Realtime from '@voiceflow/realtime-sdk';

import { resendProjectChannel } from '@/actions/project/utils';
import { AbstractNoopActionControl } from '@/actions/utils';

class TopicAdd extends AbstractNoopActionControl<Realtime.domain.TopicAddPayload> {
  protected actionCreator = Realtime.domain.topicAdd;

  protected resend = resendProjectChannel;
}

export default TopicAdd;
