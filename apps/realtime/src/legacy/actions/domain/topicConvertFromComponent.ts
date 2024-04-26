import { BaseModels, BaseNode, BaseUtils } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import { terminateResend } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { buildDBBlock, buildDBStep } from '@/legacy/actions/node/utils';

import { AbstractDomainResourceControl } from './utils';

class TopicConvertFromComponent extends AbstractDomainResourceControl<Realtime.domain.TopicConvertFromComponentPayload> {
  private static replaceStartNode = (
    primitiveDiagram: Omit<BaseModels.Diagram.Model<BaseModels.BaseDiagramNode>, '_id' | 'creatorID' | 'versionID'>
  ) => {
    const startNode = Object.values(primitiveDiagram.nodes).find(BaseUtils.step.isStart);

    if (!startNode) return primitiveDiagram;

    const intentNodeID = Utils.id.objectID();
    const nextPortID =
      startNode.data.ports?.[0]?.target ?? startNode.data.portsV2?.builtIn[BaseModels.PortType.NEXT]?.target ?? null;

    const newPrimitiveDiagram = { ...primitiveDiagram };

    newPrimitiveDiagram.nodes[startNode.nodeID] = buildDBBlock(startNode.nodeID, startNode.coords ?? [360, 120], {
      name: primitiveDiagram.name,
      color: '',
      steps: [intentNodeID],
    });

    newPrimitiveDiagram.nodes[intentNodeID] = buildDBStep<BaseNode.Intent.Step>(
      intentNodeID,
      BaseNode.NodeType.INTENT,
      {
        intent: null,
        mappings: [],
        portsV2: {
          byKey: {},
          builtIn: {
            [BaseModels.PortType.NEXT]: { id: Utils.id.objectID(), type: BaseModels.PortType.NEXT, target: nextPortID },
          },
          dynamic: [],
        },
      }
    );

    return newPrimitiveDiagram;
  };

  protected actionCreator = Realtime.domain.topicConvertFromComponent.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.domain.topicConvertFromComponent, async (ctx, { payload }) => {
    const { domainID, versionID, componentID } = payload;

    if (!domainID) {
      throw new Error('domainID is required');
    }

    const dbDiagram = await this.services.diagram.get(versionID, componentID);

    if (dbDiagram.type === BaseModels.Diagram.DiagramType.TOPIC) {
      this.reject('diagram is already a topic', Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC);
    }

    const primitiveDiagram = TopicConvertFromComponent.replaceStartNode(
      Utils.object.omit(dbDiagram, ['_id', 'creatorID', 'versionID'])
    );

    return this.createTopic({ ctx, payload, domainID, primitiveDiagram });
  });

  protected finally = async (
    ctx: Context,
    { payload }: Action<Realtime.domain.TopicConvertFromComponentPayload>
  ): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default TopicConvertFromComponent;
