import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddDynamicLink extends AbstractDiagramActionControl<Realtime.link.AddDynamicPayload> {
  actionCreator = Realtime.link.addDynamic;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.AddDynamicPayload>): Promise<void> => {
    await this.services.diagram.addDynamicLink(payload.diagramID, payload.sourceNodeID, payload.sourcePortID, payload.targetNodeID, payload.data);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.AddDynamicPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default AddDynamicLink;
