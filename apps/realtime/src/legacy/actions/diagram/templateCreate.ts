import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

import { AbstractDiagramResourceControl } from './utils';

class TemplateCreate extends AbstractDiagramResourceControl<Realtime.diagram.TemplateCreatePayload> {
  protected actionCreator = Realtime.diagram.templateCreate.started;

  protected process = this.reply(Realtime.diagram.templateCreate, async (ctx, { payload }) => {
    const { creatorID, clientID } = ctx.data;

    const dbDiagram = await this.services.diagram.create({
      ...Realtime.Utils.diagram.templateDiagramFactory(payload.template.name),
      ...payload.template,
      creatorID,
      versionID: payload.versionID,
    });

    const diagram = Realtime.Adapters.diagramAdapter.fromDB(dbDiagram);

    await this.services.version.patch(payload.versionID, { templateDiagramID: diagram.diagramID });

    await this.server.processAs(
      creatorID,
      clientID,
      Realtime.diagram.crud.add({
        key: diagram.diagramID,
        value: diagram,
        versionID: payload.versionID,
        projectID: payload.projectID,
        workspaceID: payload.workspaceID,
      })
    );

    return diagram;
  });

  protected finally = async (
    ctx: Context<WorkspaceContextData>,
    { payload }: Action<Realtime.diagram.TemplateCreatePayload>
  ): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default TemplateCreate;
