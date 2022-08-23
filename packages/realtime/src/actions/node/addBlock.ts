import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class AddBlock extends AbstractDiagramActionControl<Realtime.node.AddBlockPayload> {
  actionCreator = Realtime.node.addBlock;

  process = async (_ctx: Context, { payload }: Action<Realtime.node.AddBlockPayload>): Promise<void> => {
    const {
      diagramID,
      blockID,
      blockName,
      blockCoords: [blockX, blockY],
      blockPorts,
      blockColor,
      stepID,
      stepData,
      stepPorts,
      projectMeta,
      schemaVersion,
    } = payload;

    const nodes = extractNodes(diagramID, projectMeta, schemaVersion, {
      rootNodeIDs: [blockID],
      data: {
        [blockID]: { name: blockName, type: Realtime.BlockType.COMBINED },
        [stepID]: stepData,
      },
      ports: {
        [blockID]: blockPorts,
        [stepID]: stepPorts,
      },
      nodes: [
        {
          id: blockID,
          type: Realtime.BlockType.COMBINED,
          x: blockX,
          y: blockY,
          parentNode: null,
          ports: Realtime.Utils.port.extractNodePorts(blockPorts),
          combinedNodes: [stepID],
        },
        {
          id: stepID,
          type: stepData.type,
          x: 0,
          y: 0,
          parentNode: blockID,
          ports: Realtime.Utils.port.extractNodePorts(stepPorts),
          combinedNodes: [],
        },
      ],
    });

    if (blockColor) {
      nodes.forEach((node) => {
        if (node.nodeID === blockID) {
          Object.assign(node.data, { color: blockColor });
        }
      });
    }

    await this.services.diagram.addManyNodes(diagramID, nodes);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.AddBlockPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const { diagramID, versionID, projectID, workspaceID, blockID, blockName } = payload;
    const actionContext = { diagramID, versionID, projectID, workspaceID };

    await this.server.processAs(
      creatorID,
      Realtime.diagram.addNewStartingBlocks({ ...actionContext, startingBlocks: [{ blockID, name: blockName }] })
    );
  };
}

export default AddBlock;
