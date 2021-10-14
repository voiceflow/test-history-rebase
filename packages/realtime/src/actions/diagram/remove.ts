import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from './utils';

type RemoveDiagramPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveDiagram extends AbstractDiagramResourceControl<RemoveDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveDiagramPayload>) => {
    await this.services.diagram.delete(Number(ctx.userId), payload.key);
  };
}

export default RemoveDiagram;
