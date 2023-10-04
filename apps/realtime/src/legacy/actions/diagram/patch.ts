import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

import { AbstractDiagramResourceControl } from './utils';

interface PatchDiagramPayload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Pick<Realtime.Diagram, 'name'>> {}

class PatchDiagram extends AbstractDiagramResourceControl<PatchDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.patch;

  protected process = async (_ctx: Context, { payload }: Action<PatchDiagramPayload>) => {
    await this.services.diagram.patch(payload.versionID, payload.key, payload.value);
  };

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<PatchDiagramPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchDiagram;
