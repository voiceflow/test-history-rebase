import { BaseModels, BaseNode, BaseUtils } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { buildDBBlock, buildDBStep } from '@/actions/node/utils';

import { AbstractDomainResourceControl } from './utils';

class TopicConvertFromComponent extends AbstractDomainResourceControl<Realtime.domain.TopicConvertFromComponentPayload> {
  private static replaceStartNode = (
    primitiveDiagram: Omit<BaseModels.Diagram.Model<BaseModels.BaseDiagramNode>, '_id' | 'creatorID' | 'versionID'>
  ) => {
    const startNode = Object.values(primitiveDiagram.nodes).find(BaseUtils.step.isStart);

    if (!startNode) return primitiveDiagram;

    const intentNodeID = Utils.id.objectID();
    const nextPortID = startNode.data.ports?.[0]?.target ?? startNode.data.portsV2?.builtIn[BaseModels.PortType.NEXT]?.target ?? null;

    const newPrimitiveDiagram = { ...primitiveDiagram };

    newPrimitiveDiagram.nodes[startNode.nodeID] = buildDBBlock(startNode.nodeID, startNode.coords ?? [360, 120], {
      name: primitiveDiagram.name,
      color: '',
      steps: [intentNodeID],
    });

    newPrimitiveDiagram.nodes[intentNodeID] = buildDBStep<BaseNode.Intent.Step>(intentNodeID, BaseNode.NodeType.INTENT, {
      intent: null,
      mappings: [],
      portsV2: {
        byKey: {},
        builtIn: {
          [BaseModels.PortType.NEXT]: { id: Utils.id.objectID(), type: BaseModels.PortType.NEXT, target: nextPortID },
        },
        dynamic: [],
      },
    });

    return newPrimitiveDiagram;
  };

  protected actionCreator = Realtime.domain.topicConvertFromComponent.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.domain.topicConvertFromComponent, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { domainID, versionID, projectID, componentID, workspaceID } = payload;

    const dbDiagram = await this.services.diagram.get(componentID);

    if (dbDiagram.type === BaseModels.Diagram.DiagramType.TOPIC) {
      this.reject('diagram is already a topic', Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC);
    }

    const primitiveDiagram = TopicConvertFromComponent.replaceStartNode(Utils.object.omit(dbDiagram, ['_id', 'creatorID', 'versionID']));

    const newDiagram = await this.createTopic({ ctx, payload, domainID, primitiveDiagram });

    await this.server.processAs(creatorID, Realtime.diagram.componentRemove({ domainID, versionID, projectID, workspaceID, diagramID: componentID }));

    return newDiagram;
  });

  protected finally = async (ctx: Context, { payload }: Action<Realtime.domain.TopicConvertFromComponentPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default TopicConvertFromComponent;
