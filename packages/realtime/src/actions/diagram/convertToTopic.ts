import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { buildDBBlock, buildDBStep } from '@/actions/node/utils';

import { AbstractDiagramResourceControl, NewDiagramContextData } from './utils';

class ConvertToTopic extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload, NewDiagramContextData> {
  protected actionCreator = Realtime.diagram.convertToTopic.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.diagram.convertToTopic, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const diagram = await this.services.diagram.get(creatorID, payload.diagramID);

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
        color: Realtime.BLOCK_STANDARD_COLOR,
        steps: [intentNodeID],
      });

      primitiveDiagram.nodes[intentNodeID] = buildDBStep<BaseNode.Intent.Step>(intentNodeID, BaseNode.NodeType.INTENT, {
        intent: null,
        mappings: [],
        portsV2: {
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

    const intentNodes = Object.values(primitiveDiagram.nodes).filter(Realtime.Utils.typeGuards.isIntentDBNode);

    const [version, newDiagram] = await Promise.all([
      this.services.version.get(creatorID, payload.versionID),
      this.services.diagram
        .create(creatorID, {
          ...primitiveDiagram,
          type: BaseModels.Diagram.DiagramType.TOPIC,
          creatorID,
          versionID: payload.versionID,
          intentStepIDs: intentNodes.map((node) => node.nodeID),
        })
        .then((dbDiagram) => Realtime.Adapters.diagramAdapter.fromDB(dbDiagram, { rootDiagramID: '' })),
    ]);

    ctx.data.newDiagram = { ...diagram, ...newDiagram };

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
      this.server.processAs(
        creatorID,
        Realtime.diagram.reloadIntentSteps({
          ...actionContext,
          diagramID: newDiagram.id,
          intentSteps: intentNodes.reduce<Realtime.diagram.DiagramIntentStepMap>(
            (acc, node) => ({
              ...acc,
              [node.nodeID]: node.data.intent
                ? {
                    intentID: node.data.intent,
                    global: !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL,
                  }
                : null,
            }),
            {}
          ),
        })
      ),
    ]);

    // remove the component once the new diagram is introduced to avoid overwriting changes to version.topics
    await Promise.all([
      this.server.processAs(creatorID, Realtime.diagram.crud.remove({ ...actionContext, key: payload.diagramID })),
      this.server.processAs(creatorID, Realtime.diagram.reloadIntentSteps({ ...actionContext, diagramID: payload.diagramID, intentSteps: {} })),
    ]);

    return newDiagram;
  });

  protected finally = async (ctx: Context<NewDiagramContextData>, { payload }: Action<Realtime.BaseDiagramPayload>) => {
    const { newDiagram } = ctx.data;
    this.reloadStartingBlocksFromNewDiagram(ctx, payload, { id: newDiagram.id, nodes: newDiagram.nodes });
  };
}

export default ConvertToTopic;
