/* eslint-disable @typescript-eslint/ban-types */
import { AbstractChannelControl as BaseAbstractChannelControl } from '@voiceflow/socket-utils';

import { LoguxControlOptions } from '@/control';

export abstract class AbstractChannelControl<P extends object, E extends object = {}, D extends object = {}> extends BaseAbstractChannelControl<
  LoguxControlOptions,
  P,
  E,
  D
> {}
