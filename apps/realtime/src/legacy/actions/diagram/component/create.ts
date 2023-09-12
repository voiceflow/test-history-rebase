import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

import { AbstractDiagramResourceControl } from '../utils';

class ComponentCreate extends AbstractDiagramResourceControl<Realtime.diagram.ComponentCreatePayload> {
  protected actionCreator = Realtime.diagram.componentCreate.started;

  protected process = this.reply(Realtime.diagram.componentCreate, async (ctx, { payload }) => this.createComponent(ctx, payload, payload.component));

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.diagram.ComponentCreatePayload>): Promise<void> => {
    this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ComponentCreate;
