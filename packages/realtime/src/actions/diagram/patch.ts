import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractDiagramResourceControl } from './utils';

type PatchDiagramPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Diagram>>;

class PatchDiagram extends AbstractDiagramResourceControl<PatchDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<PatchDiagramPayload>) => {
    await this.services.diagram.patch(ctx.data.creatorID, payload.key, _.pick(payload.value, 'name', 'intentStepIDs'));
  };
}

export default PatchDiagram;
