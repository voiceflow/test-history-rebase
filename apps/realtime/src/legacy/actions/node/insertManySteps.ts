import type { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/legacy/actions/diagram/utils';

import type { ExtractNodesOptions } from './utils';
import { extractNodes } from './utils';

class InsertManySteps extends AbstractVersionDiagramAccessActionControl<Realtime.node.InsertManyStepsPayload> {
  actionCreator = Realtime.node.insertManySteps;

  protected process = async (
    _ctx: Context,
    { payload }: Action<Realtime.node.InsertManyStepsPayload>
  ): Promise<void> => {
    const {
      versionID,
      diagramID,
      parentNodeID,
      steps,
      index,
      projectMeta,
      schemaVersion,
      removeNodes,
      nodePortRemaps = [],
    } = payload;

    const creatorData: ExtractNodesOptions & { ports: Record<string, Realtime.PortsDescriptor> } = {
      data: {},
      ports: {},
      nodes: [],
    };

    steps.forEach((step) => {
      creatorData.data[step.stepID] = step.data;
      creatorData.ports[step.stepID] = step.ports;

      creatorData.nodes.push({
        id: step.stepID,
        type: step.data.type,
        x: 0,
        y: 0,
        parentNode: parentNodeID,
        ports: Realtime.Utils.port.extractNodePorts(step.ports),
        combinedNodes: [],
      });
    });

    const stepsToCreate = extractNodes(projectMeta, schemaVersion, creatorData) as BaseModels.BaseStep[];

    await this.services.diagram.addManySteps(versionID, diagramID, {
      steps: stepsToCreate,
      index,
      removeNodes,
      parentNodeID,
      nodePortRemaps,
    });
  };

  protected finally = async (
    ctx: Context,
    { payload }: Action<Realtime.node.InsertManyStepsPayload>
  ): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default InsertManySteps;
