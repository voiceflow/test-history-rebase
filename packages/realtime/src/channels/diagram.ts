import { parseId } from '@logux/core';
import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

type DiagramChannelContext = ChannelContext<Realtime.Channels.DiagramChannelParams, DiagramChannelContextData>;

export interface DiagramChannelContextData {
  subscribed?: boolean;
}

class DiagramChannel extends AbstractChannelControl<Realtime.Channels.DiagramChannelParams, DiagramChannelContextData> {
  private static getViewerEntityKey(diagramID: string, nodeID: string): string {
    return `${Realtime.DIAGRAM_KEY}:${diagramID}:${nodeID}`;
  }

  private async getViewers(diagramID: string): Promise<Realtime.Viewer[]> {
    const nodeIDs = await this.services.diagram.getConnectedNodes(diagramID);
    const userIDs = [...new Set(nodeIDs.map((userNodeID) => parseId(userNodeID).userId!))];

    return this.services.viewer.getViewers(userIDs);
  }

  protected channel = Realtime.Channels.diagram;

  protected access = async (ctx: DiagramChannelContext): Promise<boolean> => {
    return this.services.diagram.canRead(Number(ctx.userId), ctx.params.diagramID);
  };

  protected load = async (ctx: DiagramChannelContext): Promise<SendBackActions> => {
    const creatorID = Number(ctx.userId);
    const isAtomicActions = await this.isAtomicActionsEnabled(creatorID, ctx.params.workspaceID);

    // do not sync any data if not enabled for this diagram's workspace
    if (!isAtomicActions) return;

    const user = await this.services.user.getUserByID(creatorID);

    if (!user) return;

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

  unsubscribe = async (ctx: DiagramChannelContext): Promise<void> => {
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
