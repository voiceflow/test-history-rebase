import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from './utils';

type RemoveDiagramPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveDiagram extends AbstractDiagramResourceControl<RemoveDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveDiagramPayload>) => {
    const { creatorID } = ctx.data;
    const { key: removedDiagramID } = payload;

    const [version] = await Promise.all([
      this.services.version.get(creatorID, payload.versionID),
      this.services.diagram.delete(creatorID, removedDiagramID),
    ]);

    await this.services.version.patch(creatorID, payload.versionID, {
      topics: (version.topics ?? []).filter((topic) => topic.sourceID !== removedDiagramID),
      components: (version.components ?? []).filter((component) => component.sourceID !== removedDiagramID),
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<RemoveDiagramPayload>) => {
    const { creatorID } = ctx.data;
    const { key: removedDiagramID, versionID, projectID, workspaceID } = payload;
    const actionContext = { diagramID: removedDiagramID, versionID, projectID, workspaceID };
    await this.server.processAs(creatorID, Realtime.diagram.removeDiagramStartingBlocks({ ...actionContext, removedDiagramID }));
  };
}

export default RemoveDiagram;
