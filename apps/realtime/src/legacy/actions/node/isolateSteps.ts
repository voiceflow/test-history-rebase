import type { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

import { extractNodes } from './utils';

class IsolateSteps extends AbstractVersionDiagramAccessActionControl<Realtime.node.IsolateStepsPayload> {
  actionCreator = Realtime.node.isolateSteps;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
    const {
      stepIDs,
      diagramID,
      versionID,
      projectMeta,
      sourceParentNodeID,
      parentNodeID,
      schemaVersion,
      parentNodeData,
    } = payload;
    const { type, name, ports, coords } = parentNodeData;

    const [parentNode] = extractNodes(projectMeta, schemaVersion, {
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
      versionID,
      parentNode: parentNode as BaseModels.BaseBlock | BaseModels.BaseActions,
      sourceParentNodeID,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.IsolateStepsPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default IsolateSteps;
