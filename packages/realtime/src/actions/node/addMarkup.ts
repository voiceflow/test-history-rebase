import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class AddMarkup extends AbstractDiagramActionControl<Realtime.node.AddMarkupPayload> {
  actionCreator = Realtime.node.addMarkup;

  process = async (_ctx: Context, { payload }: Action<Realtime.node.AddMarkupPayload>): Promise<void> => {
    const {
      diagramID,
      nodeID,
      data,
      coords: [x, y],
      projectMeta,
      schemaVersion,
    } = payload;

    const nodes = extractNodes(diagramID, projectMeta, schemaVersion, {
      markupNodeIDs: [nodeID],
      data: { [nodeID]: data },
      nodes: [
        {
          id: nodeID,
          type: data.type,
          x,
          y,
          parentNode: null,
          ports: Realtime.Utils.port.createEmptyNodePorts(),
          combinedNodes: [],
        },
      ],
    });

    await this.services.diagram.addManyNodes(diagramID, nodes);
  };
}

export default AddMarkup;
