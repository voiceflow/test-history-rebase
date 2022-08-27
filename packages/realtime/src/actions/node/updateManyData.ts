import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/actions/diagram/utils';

class UpdateManyNodeData extends AbstractVersionDiagramAccessActionControl<Realtime.node.UpdateManyDataPayload> {
  actionCreator = Realtime.node.updateDataMany;

  process = async (_ctx: Context, { payload }: Action<Realtime.node.UpdateManyDataPayload>): Promise<void> => {
    const nodes = payload.nodes.map((nodeData) => ({
      nodeID: nodeData.nodeID,
      ...Realtime.Adapters.nodeDataAdapter.toDB(nodeData, {
        platform: payload.projectMeta.platform,
        projectType: payload.projectMeta.type,
        context: {},
      }),
    }));

    await this.services.diagram.updateManyNodeData(payload.diagramID, nodes);
  };
}

export default UpdateManyNodeData;
