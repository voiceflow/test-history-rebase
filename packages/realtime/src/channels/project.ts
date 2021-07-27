import { parseId } from '@logux/core';
import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractChannelControl, ChannelContext } from './utils';

class ProjectChannel extends AbstractChannelControl<Realtime.Channels.ProjectChannelParams> {
  channel = Realtime.Channels.project({ projectID: ':projectID' });

  protected access = async (ctx: ChannelContext<Realtime.Channels.ProjectChannelParams>): Promise<boolean> => {
    return this.services.project.canRead(ctx.params.projectID, Number(ctx.userId));
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.ProjectChannelParams>): Promise<SendBackActions> => {
    const diagramIDs = await this.services.project.getConnectedDiagrams(ctx.params.projectID);

    const diagramsNodesIDs = await Promise.all(diagramIDs.map((diagramID) => this.services.diagram.getConnectedNodes(diagramID)));
    const diagramViewers = await Promise.all(
      diagramsNodesIDs.map((nodesIDs) => this.services.viewer.getViewers([...new Set(nodesIDs.map((nodeID) => parseId(nodeID).userId!))]))
    );

    return Realtime.project.loadViewers({
      viewers: diagramIDs.reduce<{ [diagramID: string]: Realtime.Viewer[] }>(
        (acc, diagramID, index) => Object.assign(acc, { [diagramID]: diagramViewers[index] }),
        {}
      ),
      projectID: ctx.params.projectID,
    });
  };
}

export default ProjectChannel;
