import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/actions/utils';

// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractLinkActionControl<
  P extends Realtime.BaseLinkPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.canRead(ctx.data.creatorID, action.payload.diagramID);
}
