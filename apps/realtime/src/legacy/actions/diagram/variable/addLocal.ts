import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

import { AbstractDiagramResourceControl } from '../utils';

class AddLocalVariable extends AbstractDiagramResourceControl<Realtime.diagram.LocalVariablePayload> {
  protected actionCreator = Realtime.diagram.addLocalVariable;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.diagram.LocalVariablePayload>) => {
    const { variables } = await this.services.diagram.get(payload.versionID, payload.diagramID);

    await this.services.diagram.patch(payload.versionID, payload.diagramID, { variables: Utils.array.append(variables, payload.variable) });
  };

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.diagram.LocalVariablePayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default AddLocalVariable;
