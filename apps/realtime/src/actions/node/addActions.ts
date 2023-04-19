import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class AddActions extends AbstractDiagramActionControl<Realtime.node.AddActionsPayload> {
  actionCreator = Realtime.node.addActions;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.AddActionsPayload>): Promise<void> => {
    const {
      diagramID,
      actionsID,
      actionsCoords: [actionX, actionY],
      actionsPorts,
      stepID,
      stepData,
      stepPorts,
      projectMeta,
      schemaVersion,
    } = payload;

    const nodes = extractNodes(diagramID, projectMeta, schemaVersion, {
      rootNodeIDs: [actionsID],
      data: {
        [actionsID]: { type: Realtime.BlockType.ACTIONS, name: '' },
        [stepID]: stepData,
      },
      ports: {
        [actionsID]: actionsPorts,
        [stepID]: stepPorts,
      },
      nodes: [
        {
          x: actionX,
          y: actionY,
          id: actionsID,
          type: Realtime.BlockType.ACTIONS,
          ports: Realtime.Utils.port.extractNodePorts(actionsPorts),
          parentNode: null,
          combinedNodes: [stepID],
        },
        {
          x: 0,
          y: 0,
          id: stepID,
          type: stepData.type,
          ports: Realtime.Utils.port.extractNodePorts(stepPorts),
          parentNode: actionsID,
          combinedNodes: [],
        },
      ],
    });

    await this.services.diagram.addManyNodes(diagramID, { nodes });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.AddActionsPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default AddActions;
