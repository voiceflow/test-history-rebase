import { parseId } from '@logux/core';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractChannelControl, ChannelContext } from './utils';

class DiagramChannel extends AbstractChannelControl<Realtime.Channels.DiagramChannelParams> {
  private static getViewerEntityKey(diagramID: string, nodeID: string): string {
    return `${Realtime.DIAGRAM_KEY}:${diagramID}:${nodeID}`;
  }

  private async getViewers(diagramID: string): Promise<Realtime.Viewer[]> {
    const nodeIDs = await this.services.diagram.getConnectedNodes(diagramID);
    const userIDs = [...new Set(nodeIDs.map((userNodeID) => parseId(userNodeID).userId!))];

    return this.services.viewer.getViewers(userIDs);
  }

  protected channel = Realtime.Channels.diagram;

  protected access = async (ctx: ChannelContext<Realtime.Channels.DiagramChannelParams>): Promise<boolean> => {
    return this.services.diagram.canRead(Number(ctx.userId), ctx.params.diagramID);
  };

  protected finally = async (ctx: ChannelContext<Realtime.Channels.DiagramChannelParams>): Promise<void> => {
    // TODO: check if the subscription is succeeded

    const user = await this.services.user.getUserByID(Number(ctx.userId));

    if (!user) {
      return;
    }

    await Promise.all([
      this.services.diagram.connectNode(ctx.params.diagramID, ctx.nodeId),
      this.services.project.connectDiagram(ctx.params.projectID, ctx.params.diagramID),
      this.services.viewer.addViewer(ctx.userId, DiagramChannel.getViewerEntityKey(ctx.params.diagramID, ctx.nodeId), {
        name: user.name,
        image: user.image,
        creatorID: user.creator_id,
      }),
    ]);

    const viewers = await this.getViewers(ctx.params.diagramID);

    await this.server.processAs(
      user.creator_id,
      Realtime.project.awareness.updateViewers({
        viewers,
        diagramID: ctx.params.diagramID,
        projectID: ctx.params.projectID,
        workspaceID: ctx.params.workspaceID,
      })
    );
  };

  unsubscribe = async (ctx: ChannelContext<Realtime.Channels.DiagramChannelParams>): Promise<void> => {
    await Promise.all([
      this.services.diagram.disconnectNode(ctx.params.diagramID, ctx.nodeId),
      this.services.viewer.removeViewer(ctx.userId, DiagramChannel.getViewerEntityKey(ctx.params.diagramID, ctx.nodeId)),
    ]);

    const connectedNodesSize = await this.services.diagram.getConnectedNodesSize(ctx.params.diagramID);

    if (!connectedNodesSize) {
      await this.services.project.disconnectDiagram(ctx.params.projectID, ctx.params.diagramID);
    }

    const viewers = await this.getViewers(ctx.params.diagramID);

    await this.server.processAs(
      Number(ctx.userId),
      Realtime.project.awareness.updateViewers({
        viewers,
        diagramID: ctx.params.diagramID,
        projectID: ctx.params.projectID,
        workspaceID: ctx.params.workspaceID,
      })
    );
  };
}

export default DiagramChannel;
