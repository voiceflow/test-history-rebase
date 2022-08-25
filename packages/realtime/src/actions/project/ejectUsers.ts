import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractProjectChannelControl } from './utils';

class EjectUsersControl extends AbstractProjectChannelControl<Realtime.project.EjectUsersPayload> {
  protected actionCreator = Realtime.project.ejectUsers;

  protected process = Utils.functional.noop;
}

export default EjectUsersControl;
