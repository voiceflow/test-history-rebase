import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

import { extractNodes } from './utils';

class AddMarkup extends AbstractDiagramActionControl<Realtime.node.AddMarkupPayload> {
  actionCreator = Realtime.node.addMarkup;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.AddMarkupPayload>): Promise<void> => {
    const {
      diagramID,
      nodeID,
      versionID,
      data,
      coords: [x, y],
      projectMeta,
      schemaVersion,
    } = payload;

    const nodes = extractNodes(projectMeta, schemaVersion, {
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

    await this.services.diagram.addManyNodes(versionID, diagramID, { nodes });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.AddMarkupPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default AddMarkup;
