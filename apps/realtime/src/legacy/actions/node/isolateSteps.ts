import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

import { extractNodes } from './utils';

class IsolateSteps extends AbstractVersionDiagramAccessActionControl<Realtime.node.IsolateStepsPayload> {
  actionCreator = Realtime.node.isolateSteps;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
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
      diagramID,
      parentNode: parentNode as BaseModels.BaseBlock | BaseModels.BaseActions,
      sourceParentNodeID,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default IsolateSteps;
