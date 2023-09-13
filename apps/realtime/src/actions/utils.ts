/* eslint-disable max-classes-per-file */
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import {
  AbstractActionControl as BaseAbstractActionControl,
  AbstractNoopActionControl as BaseAbstractNoopActionControl,
  BaseContextData,
  Context,
} from '@voiceflow/socket-utils';

import { LoguxControlOptions } from '../control';

export abstract class AbstractActionControl<P, D extends BaseContextData = BaseContextData> extends BaseAbstractActionControl<
  LoguxControlOptions,
  P,
  D
> {
  protected handleExpiredAuth = async (ctx: Context<D>): Promise<void> => {
    await ctx.sendBack(Realtime.protocol.reloadSession(null));
  };
}

export abstract class AbstractNoopActionControl<P> extends BaseAbstractNoopActionControl<LoguxControlOptions, P> {}
