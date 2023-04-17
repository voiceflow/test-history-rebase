import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/actions/diagram/utils';

import { extractNodes, ExtractNodesOptions } from './utils';

class InsertStep extends AbstractVersionDiagramAccessActionControl<Realtime.node.InsertStepPayload> {
  actionCreator = Realtime.node.insertStep;

  protected process = async (ctx: Context, { payload }: Action<Realtime.node.InsertStepPayload>): Promise<void> => {
    const { diagramID, parentNodeID, stepID, data, ports, index, isActions, projectMeta, schemaVersion, nodePortRemaps } = payload;

    const creatorData: ExtractNodesOptions = {
      data: { [stepID]: data },
      ports: { [stepID]: ports },
      nodes: [
        {
          id: stepID,
          type: data.type,
          x: 0,
          y: 0,
          parentNode: parentNodeID,
          ports: Realtime.Utils.port.extractNodePorts(ports),
          combinedNodes: [],
        },
      ],
    };

    const [step] = extractNodes(diagramID, projectMeta, schemaVersion, creatorData);

    await this.services.diagram.addStep(diagramID, {
      step: step as BaseModels.BaseStep,
      index,
      isActions,
      menuNodeIDs: !this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_3_0),
      parentNodeID,
      nodePortRemaps,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.InsertStepPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default InsertStep;
