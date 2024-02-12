import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

class UpdateUnreadTranscripts extends AbstractProjectChannelControl<Realtime.transcript.UpdateUnreadTranscriptsPayload> {
  protected actionCreator = Realtime.transcript.updateUnreadTranscripts;

  protected process = Utils.functional.noop;
}

export default UpdateUnreadTranscripts;
