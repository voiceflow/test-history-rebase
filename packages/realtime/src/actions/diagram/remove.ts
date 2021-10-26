import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractDiagramResourceControl } from './utils';

type RemoveDiagramPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveDiagram extends AbstractDiagramResourceControl<RemoveDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveDiagramPayload>) => {
    await this.services.diagram.delete(ctx.data.creatorID, payload.key);
  };
}

export default RemoveDiagram;
