import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from './utils';

class UpdateWorkspaceImage extends AbstractWorkspaceChannelControl<Realtime.workspace.UpdateWorkspaceImagePayload> {
  protected actionCreator = Realtime.workspace.updateImage;

  protected process = Utils.functional.noop;
}

export default UpdateWorkspaceImage;
