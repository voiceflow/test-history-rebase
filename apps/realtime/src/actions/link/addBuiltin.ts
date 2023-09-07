import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddBuiltinLink extends AbstractDiagramActionControl<Realtime.link.AddBuiltinPayload> {
  actionCreator = Realtime.link.addBuiltin;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.AddBuiltinPayload>): Promise<void> => {
    await this.services.diagram.addBuiltInLink(payload.diagramID, payload.sourceNodeID, payload.type, payload.targetNodeID, payload.data);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.AddBuiltinPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default AddBuiltinLink;
