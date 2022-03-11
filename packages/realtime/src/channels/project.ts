import { parseId } from '@logux/core';
import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class ProjectChannel extends AbstractChannelControl<Realtime.Channels.ProjectChannelParams> {
  protected channel = Realtime.Channels.project;

  protected access = async (ctx: ChannelContext<Realtime.Channels.ProjectChannelParams>): Promise<boolean> => {
    return this.services.project.canRead(Number(ctx.userId), ctx.params.projectID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.ProjectChannelParams>): Promise<SendBackActions> => {
    const { workspaceID, projectID } = ctx.params;

    const diagramIDs = await this.services.project.getConnectedDiagrams(projectID);

    const diagramsNodesIDs = await Promise.all(diagramIDs.map((diagramID) => this.services.diagram.getConnectedNodes(diagramID)));
    const diagramViewers = await Promise.all(
      diagramsNodesIDs.map((nodesIDs) => this.services.viewer.getViewers([...new Set(nodesIDs.map((nodeID) => parseId(nodeID).userId!))]))
    );

    return Realtime.project.awareness.loadViewers({
      viewers: diagramIDs.reduce<{ [diagramID: string]: Realtime.Viewer[] }>(
        (acc, diagramID, index) => Object.assign(acc, { [diagramID]: diagramViewers[index] }),
        {}
      ),
      projectID,
      workspaceID,
    });
  };
}

export default ProjectChannel;
