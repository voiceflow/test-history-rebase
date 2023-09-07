import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class SubtopicCreate extends AbstractDiagramResourceControl<Realtime.diagram.SubtopicCreatePayload> {
  protected actionCreator = Realtime.diagram.subtopicCreate.started;

  protected process = this.reply(Realtime.diagram.subtopicCreate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { domainID, versionID, projectID, workspaceID, subtopic, rootTopicID } = payload;

    const dbTopicDiagram = await this.services.diagram.createTopic({
      creatorID,
      versionID,
      primitiveDiagram: subtopic,
    });

    const topicDiagram = Realtime.Adapters.diagramAdapter.fromDB(dbTopicDiagram);

    await this.services.diagram.addMenuItem(rootTopicID, { type: BaseModels.Diagram.MenuItemType.DIAGRAM, sourceID: topicDiagram.id });

    await Promise.all([
      this.reloadSharedNodes(ctx, payload, [dbTopicDiagram]),
      this.server.processAs(creatorID, Realtime.diagram.crud.add({ versionID, projectID, workspaceID, key: topicDiagram.id, value: topicDiagram })),
      this.server.processAs(
        creatorID,
        Realtime.diagram.addMenuItem({
          type: BaseModels.Diagram.MenuItemType.DIAGRAM,
          domainID,
          sourceID: topicDiagram.id,
          diagramID: rootTopicID,
          versionID,
          projectID,
          workspaceID,
        })
      ),
    ]);

    return topicDiagram;
  });

  protected finally = async (ctx: Context, { payload }: Action<Realtime.diagram.SubtopicCreatePayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default SubtopicCreate;
