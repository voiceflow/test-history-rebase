import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractDiagramResourceControl } from '../utils';

class AddLocalVariable extends AbstractDiagramResourceControl<Realtime.diagram.LocalVariablePayload> {
  protected actionCreator = Realtime.diagram.addLocalVariable;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.LocalVariablePayload>) => {
    const { creatorID } = ctx.data;
    const { variables } = await this.services.diagram.get(creatorID, payload.diagramID);

    await this.services.diagram.patch(creatorID, payload.diagramID, { variables: Realtime.Utils.array.append(variables, payload.variable) });
  };
}

export default AddLocalVariable;
