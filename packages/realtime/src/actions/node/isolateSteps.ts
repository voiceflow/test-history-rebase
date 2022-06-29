import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class IsolateSteps extends AbstractDiagramActionControl<Realtime.node.IsolateStepsPayload> {
  actionCreator = Realtime.node.isolateSteps;

  process = async (ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const { stepIDs, diagramID, projectMeta, sourceParentNodeID, parentNodeID, schemaVersion, parentNodeData } = payload;
    const { type, name, ports, coords } = parentNodeData;

    const [parentNode] = extractNodes(diagramID, projectMeta, schemaVersion, {
      rootNodeIDs: [parentNodeID],
      data: { [parentNodeID]: { name, type } },
      ports: { [parentNodeID]: ports },
      nodes: [
        {
          x: coords[0],
          y: coords[1],
          id: parentNodeID,
          type,
          ports: Realtime.Utils.port.extractNodePorts(ports),
          parentNode: null,
          combinedNodes: stepIDs,
        },
      ],
    });

    await this.services.diagram.isolateSteps({
      stepIDs,
      creatorID,
      diagramID,
      parentNode: parentNode as BaseModels.BaseBlock | BaseModels.BaseActions,
      sourceParentNodeID,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const { diagramID, versionID, projectID, workspaceID, parentNodeID, parentNodeData } = payload;
    const actionContext = { diagramID, versionID, projectID, workspaceID };

    if (parentNodeData.type !== Realtime.BlockType.COMBINED) return;

    await this.server.processAs(
      creatorID,
      Realtime.diagram.addNewStartingBlocks({ ...actionContext, startingBlocks: [{ blockID: parentNodeID, name: parentNodeData.name }] })
    );
  };
}

export default IsolateSteps;
