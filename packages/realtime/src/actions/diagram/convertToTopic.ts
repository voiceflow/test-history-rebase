import { Models as BaseModels, Node as BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/actions/workspace/utils';

import { AbstractDiagramResourceControl } from './utils';

class convertToTopic extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.convertToTopic;

  protected resend = terminateResend;

  protected process = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.BaseDiagramPayload>): Promise<void> => {
    const { creatorID } = ctx.data;

    const diagram = await this.services.diagram.get(creatorID, payload.diagramID);

    const { versionID: _versionID, creatorID: _creatorID, _id, ...primitiveDiagram } = diagram;

    if (primitiveDiagram.type === BaseModels.DiagramType.TOPIC) {
      return;
    }

    const startNodeID = Object.values(primitiveDiagram.nodes).find((node) => node.type === BaseNode.NodeType.START)?.nodeID;

    if (startNodeID) {
      const startNode = primitiveDiagram.nodes[startNodeID];
      const intentNodeID = Utils.id.objectID();

      primitiveDiagram.nodes[startNodeID] = {
        type: 'block',
        nodeID: startNodeID,
        coords: startNode.coords ?? [360, 120],
        data: {
          name: primitiveDiagram.name,
          color: Realtime.BlockVariant.STANDARD,
          steps: [intentNodeID],
        },
      };

      primitiveDiagram.nodes[intentNodeID] = {
        type: BaseNode.NodeType.INTENT,
        nodeID: intentNodeID,
        data: {
          intent: null,
          mappings: [],
          ports: [{ type: '', target: startNode.data.ports?.[0]?.target ?? null }],
        },
      };
    }

    const intentSteps = Object.values(primitiveDiagram.nodes).filter((node) => node.type === BaseNode.NodeType.INTENT);

    const [version, newDiagram] = await Promise.all([
      this.services.version.get(creatorID, payload.versionID),
      this.services.diagram
        .create(creatorID, {
          ...primitiveDiagram,
          type: BaseModels.DiagramType.TOPIC,
          creatorID,
          versionID: payload.versionID,
          intentStepIDs: intentSteps.map((node) => node.nodeID),
        })
        .then((dbDiagram) => Realtime.Adapters.diagramAdapter.fromDB(dbDiagram, { rootDiagramID: '' })),
    ] as const);

    const actionContext = {
      versionID: payload.versionID,
      projectID: payload.projectID,
      workspaceID: payload.workspaceID,
    };

    await Promise.all([
      this.services.version.patch(creatorID, payload.versionID, {
        topics: [...(version.topics ?? []), { sourceID: newDiagram.id, type: BaseModels.VersionFolderItemType.DIAGRAM }],
      }),
      this.server.processAs(creatorID, Realtime.diagram.crud.remove({ ...actionContext, key: payload.diagramID })),
      this.server.processAs(creatorID, Realtime.diagram.reloadIntentSteps({ ...actionContext, diagramID: payload.diagramID, intentSteps: {} })),
      this.server.processAs(creatorID, Realtime.diagram.crud.add({ ...actionContext, key: newDiagram.id, value: newDiagram })),
      this.server.processAs(
        creatorID,
        Realtime.diagram.reloadIntentSteps({
          ...actionContext,
          diagramID: newDiagram.id,
          intentSteps: intentSteps.reduce<Record<string, string | null>>(
            (acc, node) => Object.assign(acc, { [node.nodeID]: node.data.intent ?? null }),
            {}
          ),
        })
      ),
    ]);
  };
}

export default convertToTopic;
