import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

import { AbstractDiagramResourceControl } from '../utils';

class ComponentDuplicate extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.componentDuplicate.started;

  protected process = this.reply(Realtime.diagram.componentDuplicate, async (ctx, { payload }) => {
    const { versionID, diagramID } = payload;

    const [componentDBDiagram, componentNames] = await Promise.all([
      this.services.diagram.get(diagramID),
      this.services.version.getComponentNames(versionID),
    ]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(componentDBDiagram.name, componentNames);

    return this.createComponent(ctx, payload, { ...Utils.object.omit(componentDBDiagram, ['_id', 'creatorID', 'versionID']), name: uniqueName });
  });

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.BaseDiagramPayload>): Promise<void> => {
    this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ComponentDuplicate;
