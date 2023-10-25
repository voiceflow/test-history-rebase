import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

import { AbstractDiagramResourceControl } from '../utils';

class ComponentDuplicate extends AbstractDiagramResourceControl<Realtime.diagram.ComponentDuplicatePayload> {
  protected actionCreator = Realtime.diagram.componentDuplicate.started;

  protected process = this.reply(Realtime.diagram.componentDuplicate, async (ctx, { payload }) => {
    const { versionID, diagramID, sourceVersionID, sourceComponentID } = payload;

    const [componentDBDiagram, componentNames] = await Promise.all([
      // TODO: remove `?? versionID` and `?? diagramID` in a few weeks after component duplication fix is fully rolled out
      this.services.diagram.get(sourceVersionID ?? versionID, sourceComponentID ?? diagramID),
      this.services.version.getComponentNames(versionID),
    ]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(componentDBDiagram.name, componentNames);

    return this.createComponent(ctx, payload, {
      ...Utils.object.omit(componentDBDiagram, ['_id', 'creatorID', 'versionID', 'diagramID']),
      name: uniqueName,
    });
  });

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.diagram.ComponentDuplicatePayload>): Promise<void> => {
    this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ComponentDuplicate;
