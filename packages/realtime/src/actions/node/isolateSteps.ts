import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class IsolateSteps extends AbstractDiagramActionControl<Realtime.node.IsolateStepsPayload> {
  actionCreator = Realtime.node.isolateSteps;

  process = async (ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const {
      diagramID,
      sourceBlockID,
      blockID,
      blockName,
      blockCoords: [blockX, blockY],
      blockPorts,
      stepIDs,
      projectMeta,
      schemaVersion,
      removeSource,
      nodePortRemaps,
    } = payload;

    const [block] = extractNodes(diagramID, projectMeta, schemaVersion, {
      rootNodeIDs: [blockID],
      data: {
        [blockID]: { name: blockName, type: Realtime.BlockType.COMBINED },
      },
      ports: { [blockID]: blockPorts },
      nodes: [
        {
          id: blockID,
          type: Realtime.BlockType.COMBINED,
          x: blockX,
          y: blockY,
          parentNode: null,
          ports: Realtime.Utils.port.extractNodePorts(blockPorts),
          combinedNodes: stepIDs,
        },
      ],
    });

    await this.services.diagram.isolateSteps({ creatorID, diagramID, sourceBlockID, block, stepIDs, removeSource, nodePortRemaps });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const { diagramID, versionID, projectID, workspaceID, blockID, blockName } = payload;
    const actionContext = { diagramID, versionID, projectID, workspaceID };

    await this.server.processAs(
      creatorID,
      Realtime.diagram.addNewStartingBlocks({ ...actionContext, startingBlocks: [{ blockID, name: blockName }] })
    );
  };
}

export default IsolateSteps;
