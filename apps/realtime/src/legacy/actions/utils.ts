/* eslint-disable max-classes-per-file */
import type { Logger } from '@voiceflow/logger';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { BaseContextData, Context } from '@voiceflow/socket-utils';
import {
  AbstractActionControl as BaseAbstractActionControl,
  AbstractNoopActionControl as BaseAbstractNoopActionControl,
} from '@voiceflow/socket-utils';

import type { LoguxControlOptions } from '../control';

export abstract class AbstractActionControl<
  P,
  D extends BaseContextData = BaseContextData,
> extends BaseAbstractActionControl<LoguxControlOptions, P, D> {
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
