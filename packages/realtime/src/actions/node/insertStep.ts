import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes, ExtractNodesOptions } from './utils';

class InsertStep extends AbstractDiagramActionControl<Realtime.node.InsertStepPayload> {
  actionCreator = Realtime.node.insertStep;

  process = async (ctx: Context, { payload }: Action<Realtime.node.InsertStepPayload>): Promise<void> => {
    const { diagramID, blockID, stepID, data, ports, index, projectMeta, schemaVersion, nodePortRemaps } = payload;

    const creatorData: ExtractNodesOptions = {
      data: { [stepID]: data },
      ports: { [stepID]: ports },
      nodes: [
        {
          id: stepID,
          type: data.type,
          x: 0,
          y: 0,
          parentNode: blockID,
          ports: Realtime.Utils.port.extractNodePorts(ports),
          combinedNodes: [],
        },
      ],
    };

    const [[newStepPortRemap], filteredNodePortRemaps] = Utils.array.separate(nodePortRemaps, ({ nodeID }) => nodeID === stepID);

    // this is quite awful, but we are creating a "fake" combine step so all the ports of the new step will point to the targetNodeID
    if (newStepPortRemap?.targetNodeID) {
      creatorData.data[blockID] = { name: '', type: Realtime.BlockType.COMBINED };
      creatorData.nodes.push({
        ...creatorData.nodes[0],
        id: blockID,
        combinedNodes: [stepID, newStepPortRemap.targetNodeID],
      });
    }

    const [step] = extractNodes(diagramID, projectMeta, schemaVersion, creatorData);

    await this.services.diagram.addStep({ creatorID: ctx.data.creatorID, diagramID, blockID, step, index, nodePortRemaps: filteredNodePortRemaps });
  };
}

export default InsertStep;
