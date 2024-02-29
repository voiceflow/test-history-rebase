import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class AddDynamicLink extends AbstractDiagramActionControl<Realtime.link.AddDynamicPayload> {
  actionCreator = Realtime.link.addDynamic;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.AddDynamicPayload>): Promise<void> => {
    await this.services.diagram.addDynamicLink(payload.versionID, payload.diagramID, payload.sourceNodeID, {
      portID: payload.sourcePortID,
      target: payload.targetNodeID,
      data: payload.data,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.AddDynamicPayload>): Promise<void> => {
    const diagram = await this.services.diagram.get(payload.versionID, payload.diagramID);
    const isComponent = diagram.type === BaseModels.Diagram.DiagramType.COMPONENT;

    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      ...[
        isComponent ??
          this.server.processAs(
            ctx.data.creatorID,
            ctx.data.clientID,
            Actions.Flow.PatchOneUpadtedBy({
              diagramID: diagram._id,
              context: { environmentID: payload.versionID, assistantID: payload.projectID },
            })
          ),
      ],
    ]);
  };
}

export default AddDynamicLink;
