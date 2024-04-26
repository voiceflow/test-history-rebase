import type { SendBackActions } from '@logux/server';
import type { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { ChannelContext, ChannelSubscribeAction } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

type DiagramChannelContext = ChannelContext<Realtime.Channels.DiagramChannelParams, DiagramChannelContextData>;

export interface DiagramChannelContextData {
  subscribed?: boolean;
  dbDiagram?: BaseModels.Diagram.Model;
}

class DiagramChannel extends AbstractChannelControl<Realtime.Channels.DiagramChannelParams, DiagramChannelContextData> {
  private static getViewerEntityKey(versionID: string, diagramID: string, nodeID: string): string {
    return `${Realtime.DIAGRAM_KEY}:${versionID}:${diagramID}:${nodeID}`;
  }

  // TODO: replace with `Realtime.Channels.diagramV2` when FeatureFlag.CMS_WORKFLOWS are released
  protected channel = Realtime.Channels.diagram;

  // TODO: remove when FeatureFlag.CMS_WORKFLOWS are released
  setup() {
    super.setup();

    // subscribes to a new diagram channel without the domainID
    this.setupChannel(Realtime.Channels.diagramV2.buildMatcher());
  }

  protected access = (ctx: DiagramChannelContext): Promise<boolean> =>
    this.services.version.access.canRead(Number(ctx.userId), ctx.params.versionID);

  protected load = async (ctx: DiagramChannelContext, action: ChannelSubscribeAction): Promise<SendBackActions> => {
    const creatorID = Number(ctx.userId);
    const clientID = ctx.clientId;

    // the timestamp of Realtime.creator.initialize is when this.services.diagram.get is called, not when it is resolved
    // ORDER MATTERS
    const [rehydrateViewportMeta, initializeMeta, updateLockedEntitiesMeta] = [
      { id: this.server.log.generateId() },
      { id: this.server.log.generateId() },
      { id: this.server.log.generateId() },
    ];

    const [dbDiagram, dbProject, diagramLocks] = await Promise.all([
      this.services.diagram.get(ctx.params.versionID, ctx.params.diagramID),
      this.services.project.get(creatorID, ctx.params.projectID),
      this.services.lock.getAllLocks<Realtime.diagram.awareness.LockEntityType>(
        ctx.params.versionID,
        ctx.params.diagramID
      ),
    ]);

    const project = Realtime.Adapters.projectAdapter.fromDB(dbProject, { members: [] });

    const { nodes, data, ports, links } = Realtime.Adapters.creatorAdapter.fromDB(dbDiagram, {
      platform: project.platform,
      projectType: project.type,
      context: {},
    });

    const initializeAction = Realtime.creator.initialize({
      ...ctx.params,
      nodesWithData: nodes.map((node) => ({ node, data: data[node.id] })),
      ports,
      links,
    });

    const sendBackInitalize: SendBackActions = [[initializeAction, initializeMeta]];

    // on resubscribe broadcast your action to all other viewers
    if (action.since) {
      sendBackInitalize.pop(); // do not double send initialize action (sendBack)
      await this.server.processAs(creatorID, clientID, initializeAction, initializeMeta);
    }

    ctx.data.subscribed = true;

    return [
      [
        Realtime.diagram.viewport.rehydrate({
          viewport: {
            id: ctx.params.diagramID,
            versionID: ctx.params.versionID,
            x: dbDiagram.offsetX,
            y: dbDiagram.offsetY,
            zoom: dbDiagram.zoom,
          },
        }),
        rehydrateViewportMeta,
      ],
      ...sendBackInitalize,
      [
        Realtime.diagram.awareness.updateLockedEntities({
          ...ctx.params,
          locks: diagramLocks,
        }),
        updateLockedEntitiesMeta,
      ],
    ];
  };

  protected finally = async (ctx: DiagramChannelContext): Promise<void> => {
    // do not sync any data if subscription was not successful
    if (!ctx.data.subscribed) return;

    const creatorID = Number(ctx.userId);
    const clientID = ctx.clientId;
    const user = await this.services.user.getByID(creatorID);

    if (!user) return;

    await Promise.all([
      this.services.diagram.connectNode(ctx.params.versionID, ctx.params.diagramID, ctx.nodeId),
      this.services.project.connectDiagram(ctx.params.projectID, ctx.params.versionID, ctx.params.diagramID),
      this.services.workspace.connectProject(ctx.params.workspaceID, ctx.params.projectID),
      this.services.viewer.addViewer(
        ctx.userId,
        DiagramChannel.getViewerEntityKey(ctx.params.versionID, ctx.params.diagramID, ctx.nodeId),
        {
          name: user.name,
          image: user.image ?? '',
          creatorID: user.creator_id,
        }
      ),
    ]);

    const viewers = await this.services.diagram.getConnectedViewers(ctx.params.versionID, ctx.params.diagramID);

    await this.server.processAs(
      user.creator_id,
      clientID,
      Realtime.project.awareness.updateDiagramViewers({
        viewers,
        diagramID: ctx.params.diagramID,
        projectID: ctx.params.projectID,
        workspaceID: ctx.params.workspaceID,
      })
    );

    const client = await this.services.creator.client.getByUserID(creatorID);
    const hasUnreadTranscripts = await client.transcript.getHasUnreadTranscripts(ctx.params.projectID);

    await this.server.processAs(
      user.creator_id,
      clientID,
      Realtime.transcript.updateUnreadTranscripts({
        unreadTranscripts: hasUnreadTranscripts,
        projectID: ctx.params.projectID,
        workspaceID: ctx.params.workspaceID,
      })
    );
  };

  unsubscribe = async (ctx: DiagramChannelContext): Promise<void> => {
    await Promise.all([
      this.services.lock.unlockAllNodeEntities(ctx.params.versionID, ctx.params.diagramID, ctx.nodeId),
      this.services.diagram.disconnectNode(ctx.params.versionID, ctx.params.diagramID, ctx.nodeId),
      this.services.viewer.removeViewer(
        ctx.userId,
        DiagramChannel.getViewerEntityKey(ctx.params.versionID, ctx.params.diagramID, ctx.nodeId)
      ),
    ]);

    const connectedNodesSize = await this.services.diagram.getConnectedNodesSize(
      ctx.params.versionID,
      ctx.params.diagramID
    );

    if (!connectedNodesSize) {
      await this.services.project.disconnectDiagram(ctx.params.projectID, ctx.params.versionID, ctx.params.diagramID);
    }

    const connectedDiagramsSize = await this.services.project.getConnectedDiagramsSize(ctx.params.projectID);

    if (!connectedDiagramsSize) {
      await this.services.workspace.disconnectProject(ctx.params.workspaceID, ctx.params.projectID);
    }

    const [viewers, diagramLocks] = await Promise.all([
      this.services.diagram.getConnectedViewers(ctx.params.versionID, ctx.params.diagramID),
      this.services.lock.getAllLocks<Realtime.diagram.awareness.LockEntityType>(
        ctx.params.versionID,
        ctx.params.diagramID
      ),
    ]);

    await Promise.all([
      this.server.processAs(
        Number(ctx.userId),
        ctx.clientId,
        Realtime.project.awareness.updateDiagramViewers({
          viewers,
          diagramID: ctx.params.diagramID,
          projectID: ctx.params.projectID,
          workspaceID: ctx.params.workspaceID,
        })
      ),
      this.server.processAs(
        Number(ctx.userId),
        ctx.clientId,
        Realtime.diagram.awareness.updateLockedEntities({
          locks: diagramLocks,
          domainID: ctx.params.domainID,
          diagramID: ctx.params.diagramID,
          projectID: ctx.params.projectID,
          versionID: ctx.params.versionID,
          workspaceID: ctx.params.workspaceID,
        })
      ),
    ]);
  };
}

export default DiagramChannel;
