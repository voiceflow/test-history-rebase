import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class AddActions extends AbstractDiagramActionControl<Realtime.node.AddActionsPayload> {
  actionCreator = Realtime.node.addActions;

  process = async (ctx: Context, { payload }: Action<Realtime.node.AddActionsPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
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

    await this.services.diagram.addManyNodes(creatorID, diagramID, nodes);
  };
}

export default AddActions;
