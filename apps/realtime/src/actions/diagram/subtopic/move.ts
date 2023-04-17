import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class SubtopicMove extends AbstractDiagramResourceControl<Realtime.diagram.SubtopicMovePayload> {
  protected actionCreator = Realtime.diagram.subtopicMove;

  protected process = async (_: Context, { payload }: Action<Realtime.diagram.SubtopicMovePayload>) => {
    const { rootTopicID, toTopicID, subtopicID } = payload;

    // add to new topic
    await this.services.diagram.addMenuItem(toTopicID, { type: BaseModels.Diagram.MenuItemType.DIAGRAM, sourceID: subtopicID });

    // remove from old topic
    await this.services.diagram.removeMenuItem(rootTopicID, subtopicID);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.diagram.SubtopicMovePayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default SubtopicMove;
