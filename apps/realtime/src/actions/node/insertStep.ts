import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/actions/diagram/utils';

import { extractNodes, ExtractNodesOptions } from './utils';

class InsertStep extends AbstractVersionDiagramAccessActionControl<Realtime.node.InsertStepPayload> {
  actionCreator = Realtime.node.insertStep;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.InsertStepPayload>): Promise<void> => {
    const { diagramID, parentNodeID, stepID, data, ports, index, isActions, projectMeta, schemaVersion, nodePortRemaps = [], removeNodes } = payload;

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
      removeNodes,
      parentNodeID,
      nodePortRemaps,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.InsertStepPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default InsertStep;
