import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { resendProjectChannel } from '@/legacy/actions/project/utils';
import { AbstractNoopActionControl } from '@/legacy/actions/utils';

class TopicAdd extends AbstractNoopActionControl<Realtime.domain.TopicAddPayload> {
  protected actionCreator = Realtime.domain.topicAdd;

  protected resend = resendProjectChannel;
}

export default TopicAdd;
