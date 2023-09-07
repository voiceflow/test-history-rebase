import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import type { Required } from 'utility-types';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

export abstract class AbstractDomainResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractVersionResourceControl<P, D> {
  protected createTopic = async ({
    ctx,
    payload,
    domainID,
    primitiveDiagram,
    subtopicDiagrams = [],
    dbSubtopicDiagrams = [],
  }: {
    ctx: Context;
    payload: P;
    domainID: string;
    primitiveDiagram: Required<Partial<Realtime.Utils.diagram.PrimitiveDiagram>, 'name'>;
    subtopicDiagrams?: Realtime.Diagram[];
    dbSubtopicDiagrams?: BaseModels.Diagram.Model[];
  }): Promise<Realtime.Diagram> => {
    const { creatorID } = ctx.data;
    const { versionID, projectID, workspaceID } = payload;

    const dbTopicDiagram = await this.services.diagram.createTopic({ creatorID, versionID, primitiveDiagram });

    const topicDiagram = Realtime.Adapters.diagramAdapter.fromDB(dbTopicDiagram);

    await this.services.domain.topicAdd(versionID, domainID, topicDiagram.id);

    await Promise.all([
      this.reloadSharedNodes(ctx, payload, [dbTopicDiagram, ...dbSubtopicDiagrams]),
      this.server.processAs(
        creatorID,
        Realtime.diagram.crud.addMany({
          values: [topicDiagram, ...subtopicDiagrams],
          versionID,
          projectID,
          workspaceID,
        })
      ),
      this.server.processAs(creatorID, Realtime.domain.topicAdd({ versionID, projectID, workspaceID, domainID, topicID: topicDiagram.id })),
    ]);

    return topicDiagram;
  };
}
