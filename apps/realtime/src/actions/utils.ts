/* eslint-disable max-classes-per-file */
import { Logger } from '@voiceflow/logger';
import * as Realtime from '@voiceflow/realtime-sdk';
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
  protected log: Logger;

  constructor(options: LoguxControlOptions) {
    super(options);
    this.log = options.log;
  }

  protected handleExpiredAuth = async (ctx: Context<D>): Promise<void> => {
    await ctx.sendBack(Realtime.protocol.reloadSession(null));
  };
}

export abstract class AbstractNoopActionControl<P> extends BaseAbstractNoopActionControl<LoguxControlOptions, P> {}
