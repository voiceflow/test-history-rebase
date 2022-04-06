import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractResendDiagramActionControl } from '../utils';

class UnlockEntitiesControl extends AbstractResendDiagramActionControl<Realtime.diagram.awareness.LockUnlockEntityPayload> {
  actionCreator = Realtime.diagram.awareness.unlockEntities;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.awareness.LockUnlockEntityPayload>) => {
    await this.services.lock.unlockEntities(payload.diagramID, ctx.nodeId, payload.lockType, payload.entityIDs);
  };
}

export default UnlockEntitiesControl;
