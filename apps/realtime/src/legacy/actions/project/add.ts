import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractWorkspaceChannelControl } from '@/legacy/actions/workspace/utils';

class AddProject extends AbstractWorkspaceChannelControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Realtime.AnyProject>
> {
  protected actionCreator = Realtime.project.crud.add;

  protected process = Utils.functional.noop;
}

export default AddProject;
