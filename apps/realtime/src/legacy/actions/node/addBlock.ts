import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

import { extractNodes } from './utils';

class AddBlock extends AbstractVersionDiagramAccessActionControl<Realtime.node.AddBlockPayload> {
  actionCreator = Realtime.node.addBlock;

  protected process = async (ctx: Context, { payload }: Action<Realtime.node.AddBlockPayload>): Promise<void> => {
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
      versionID,
      workspaceID,
    } = payload;

    const nodes = extractNodes(projectMeta, schemaVersion, {
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

    await this.services.diagram.addManyNodes(versionID, diagramID, { nodes });

    if (
      this.services.feature.isEnabled(Realtime.FeatureFlag.REFERENCE_SYSTEM, {
        userID: Number(ctx.userId),
        workspaceID,
      })
    ) {
      await this.services.requestContext.create(() =>
        this.services.reference.createManyWithSubResourcesForDiagramNodesAndBroadcast(
          { nodes, diagramID },
          {
            auth: { userID: Number(ctx.userId), clientID: ctx.clientId },
            context: { assistantID: payload.projectID, environmentID: payload.versionID },
          }
        )
      );
    }
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.AddBlockPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default AddBlock;
