import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class AddLocalVariable extends AbstractDiagramResourceControl<Realtime.diagram.LocalVariablePayload> {
  protected actionCreator = Realtime.diagram.addLocalVariable;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.diagram.LocalVariablePayload>) => {
    const { variables } = await this.services.diagram.get(payload.diagramID);

    await this.services.diagram.patch(payload.diagramID, { variables: Utils.array.append(variables, payload.variable) });
  };
}

export default AddLocalVariable;
