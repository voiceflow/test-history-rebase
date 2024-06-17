import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

import { extractNodes, ExtractNodesOptions } from './utils';

class InsertStep extends AbstractVersionDiagramAccessActionControl<Realtime.node.InsertStepPayload> {
  actionCreator = Realtime.node.insertStep;

  protected process = async (ctx: Context, { payload }: Action<Realtime.node.InsertStepPayload>): Promise<void> => {
    const {
      diagramID,
      parentNodeID,
      stepID,
      versionID,
      data,
      ports,
      index,
      isActions,
      projectMeta,
      schemaVersion,
      nodePortRemaps = [],
      removeNodes,
    } = payload;

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

    const [step] = extractNodes(projectMeta, schemaVersion, creatorData);

    await this.services.diagram.addStep(versionID, diagramID, {
      step: step as BaseModels.BaseStep,
      index,
      isActions,
      removeNodes,
      parentNodeID,
      nodePortRemaps,
    });

    if (
      this.services.feature.isEnabled(Realtime.FeatureFlag.REFERENCE_SYSTEM, {
        userID: Number(ctx.userId),
        workspaceID: payload.workspaceID,
      })
    ) {
      await this.services.requestContext.createAsync(async () => {
        await Promise.all([
          this.services.reference.removeManyDiagramNodes({
            nodeIDs: removeNodes.map((node) => node.stepID ?? node.parentNodeID),
            authMeta: { userID: Number(ctx.userId), clientID: ctx.clientId },
            diagramID: payload.diagramID,
            assistantID: payload.projectID,
            environmentID: payload.versionID,
          }),

          this.services.reference.addManyDiagramNodes({
            nodes: [step],
            authMeta: { userID: Number(ctx.userId), clientID: ctx.clientId },
            diagramID: payload.diagramID,
            assistantID: payload.projectID,
            environmentID: payload.versionID,
          }),
        ]);
      });
    }
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.InsertStepPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default InsertStep;
