/* eslint-disable @typescript-eslint/ban-types */
import * as Realtime from '@voiceflow/realtime-sdk';
import { AbstractChannelControl as BaseAbstractChannelControl, ChannelContext } from '@voiceflow/socket-utils';

import { LoguxControlOptions } from '@/control';

// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractChannelControl<P extends object, E extends object = {}, D extends object = {}> extends BaseAbstractChannelControl<
  LoguxControlOptions,
  P,
  E,
  D
> {
  protected handleExpiredAuth = async (ctx: ChannelContext<P, D>): Promise<void> => {
    await ctx.sendBack(Realtime.protocol.reloadSession(null));
  };

  protected isAtomicActionsEnabled(creatorID: number, workspaceID?: string): Promise<boolean> {
    return this.services.workspace.isFeatureEnabled(creatorID, workspaceID, 'atomic_actions');
  }
}
