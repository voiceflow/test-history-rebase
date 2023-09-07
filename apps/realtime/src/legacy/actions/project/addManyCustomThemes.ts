import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class AddManyCustomThemes extends AbstractWorkspaceChannelControl<Realtime.project.AddManyCustomThemesPayload> {
  protected actionCreator = Realtime.project.addManyCustomThemes;

  protected process = Utils.functional.noop;
}

export default AddManyCustomThemes;
