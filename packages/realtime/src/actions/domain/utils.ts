import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import type { Required } from 'utility-types';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

export abstract class AbstractDomainResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractVersionResourceControl<P, D> {
  protected createTopic = async (
    ctx: Context<BaseContextData>,
    payload: P,
    domainID: string,
    primitiveDiagram: Required<Partial<Realtime.Utils.diagram.PrimitiveDiagram>, 'name'>
  ): Promise<Realtime.Diagram> => {
    const { creatorID } = ctx.data;
    const { versionID, projectID, workspaceID } = payload;

    const factoryTopic = Realtime.Utils.diagram.topicDiagramFactory(primitiveDiagram.name);

    const nodes = primitiveDiagram.nodes ?? factoryTopic.nodes;

    const intentStepIDs = Object.values(nodes)
      .filter(Realtime.Utils.typeGuards.isIntentDBNode)
      .map((node) => node.nodeID);

    const newDBDiagram = await this.services.diagram.create({
      ...factoryTopic,
      ...primitiveDiagram,
      name: primitiveDiagram.name,
      type: BaseModels.Diagram.DiagramType.TOPIC,
      nodes,
      creatorID,
      versionID,
      intentStepIDs,
    });

    const newDiagram = Realtime.Adapters.diagramAdapter.fromDB(newDBDiagram);

    await this.services.domain.topicAdd(versionID, domainID, newDiagram.id);

    await Promise.all([
      this.reloadSharedNodes(ctx, payload, [newDBDiagram]),
      this.server.processAs(creatorID, Realtime.diagram.crud.add({ versionID, projectID, workspaceID, key: newDiagram.id, value: newDiagram })),
      this.server.processAs(creatorID, Realtime.domain.topicAdd({ versionID, projectID, workspaceID, domainID, topicID: newDiagram.id })),
    ]);

    return newDiagram;
  };
}
