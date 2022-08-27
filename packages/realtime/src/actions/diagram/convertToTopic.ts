import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { terminateResend } from '@voiceflow/socket-utils';

import { buildDBBlock, buildDBStep } from '@/actions/node/utils';

import { AbstractDiagramResourceControl } from './utils';

class ConvertToTopic extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.convertToTopic.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.diagram.convertToTopic, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const diagram = await this.services.diagram.get(payload.diagramID);

    const { versionID: _versionID, creatorID: _creatorID, _id, ...primitiveDiagram } = diagram;

    if (primitiveDiagram.type === BaseModels.Diagram.DiagramType.TOPIC) {
      this.reject('diagram is already a topic', Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC);
    }

    const startNodeID = Object.values(primitiveDiagram.nodes).find((node) => node.type === BaseNode.NodeType.START)?.nodeID;

    if (startNodeID) {
      const startNode = primitiveDiagram.nodes[startNodeID] as BaseNode.Start.Step;
      const intentNodeID = Utils.id.objectID();
      const nextPortID = startNode.data.ports?.[0]?.target ?? startNode.data.portsV2?.builtIn[BaseModels.PortType.NEXT]?.target ?? null;

      primitiveDiagram.nodes[startNodeID] = buildDBBlock(startNodeID, startNode.coords ?? [360, 120], {
        name: primitiveDiagram.name,
        color: '',
        steps: [intentNodeID],
      });

      primitiveDiagram.nodes[intentNodeID] = buildDBStep<BaseNode.Intent.Step>(intentNodeID, BaseNode.NodeType.INTENT, {
        intent: null,
        mappings: [],
        portsV2: {
          byKey: {},
          builtIn: {
            [BaseModels.PortType.NEXT]: {
              id: Utils.id.objectID(),
              type: BaseModels.PortType.NEXT,
              target: nextPortID,
            },
          },
          dynamic: [],
        },
      });
    }

    const menuNodeIDs = Object.values(primitiveDiagram.nodes)
      .filter(Realtime.Utils.typeGuards.isDiagramMenuDBNode)
      .map(({ nodeID }) => nodeID);

    const [version, newDBDiagram] = await Promise.all([
      this.services.version.get(creatorID, payload.versionID),
      this.services.diagram.create({
        ...primitiveDiagram,
        type: BaseModels.Diagram.DiagramType.TOPIC,
        creatorID,
        versionID: payload.versionID,
        menuNodeIDs,
      }),
    ]);

    const newDiagram = Realtime.Adapters.diagramAdapter.fromDB(newDBDiagram, { rootDiagramID: version.rootDiagramID });

    const actionContext = {
      versionID: payload.versionID,
      projectID: payload.projectID,
      workspaceID: payload.workspaceID,
    };

    await Promise.all([
      this.services.version.patch(creatorID, payload.versionID, {
        topics: [...(version.topics ?? []), { sourceID: newDiagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }],
      }),
      this.server.processAs(creatorID, Realtime.diagram.crud.add({ ...actionContext, key: newDiagram.id, value: newDiagram })),
      this.reloadSharedNodes(ctx, payload, newDBDiagram),
    ]);

    await this.server.processAs(creatorID, Realtime.diagram.crud.remove({ ...actionContext, key: payload.diagramID }));

    return newDiagram;
  });
}

export default ConvertToTopic;
