/* eslint-disable @typescript-eslint/ban-types */
import * as Realtime from '@voiceflow/realtime-sdk';
import { AbstractChannelControl as BaseAbstractChannelControl, ChannelContext } from '@voiceflow/socket-utils';

import { LoguxControlOptions } from '@/control';

export abstract class AbstractChannelControl<P extends object, E extends object = {}, D extends object = {}> extends BaseAbstractChannelControl<
  LoguxControlOptions,
  P,
  E,
  D
> {
  protected handleExpiredAuth = async (ctx: ChannelContext<P, D>): Promise<void> => {
    await ctx.sendBack(Realtime.protocol.reloadSession(null));
  };
}
