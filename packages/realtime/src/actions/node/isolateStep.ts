import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class IsolateStep extends AbstractDiagramActionControl<Realtime.node.IsolateStepPayload> {
  actionCreator = Realtime.node.isolateStep;

  process = async (ctx: Context, { payload }: Action<Realtime.node.IsolateStepPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const {
      diagramID,
      sourceBlockID,
      blockID,
      blockName,
      blockCoords: [blockX, blockY],
      blockPorts,
      stepID,
      projectMeta,
    } = payload;

    const [block] = extractNodes(diagramID, projectMeta, {
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
          combinedNodes: [stepID],
        },
      ],
    });

    await this.services.diagram.isolateStep(creatorID, diagramID, sourceBlockID, block, stepID);
  };
}

export default IsolateStep;
