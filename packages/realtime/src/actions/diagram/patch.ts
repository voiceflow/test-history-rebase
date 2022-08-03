import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import _ from 'lodash';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from './utils';

type PatchDiagramPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Diagram>>;

class PatchDiagram extends AbstractDiagramResourceControl<PatchDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.patch;

  protected process = async (_ctx: Context, { payload }: Action<PatchDiagramPayload>) => {
    await this.services.diagram.patch(payload.key, _.pick(payload.value, 'name'));
  };
}

export default PatchDiagram;
