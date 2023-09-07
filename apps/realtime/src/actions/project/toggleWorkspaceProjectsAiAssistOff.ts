import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class ToggleWorkspaceProjectsAiAssistOff extends AbstractWorkspaceChannelControl<Realtime.project.ToggleWorkspaceProjectsAiAssistOffPayload> {
  protected actionCreator = Realtime.project.toggleWorkspaceProjectsAiAssistOff;

  protected process = async (_: Context, { payload }: Action<Realtime.project.ToggleWorkspaceProjectsAiAssistOffPayload>): Promise<void> => {
    await this.services.project.toggleWorkspaceProjectsAiAssistOff(payload.workspaceID);
  };
}

export default ToggleWorkspaceProjectsAiAssistOff;
