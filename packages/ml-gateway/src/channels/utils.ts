/* eslint-disable @typescript-eslint/ban-types */
import { AbstractChannelControl as BaseAbstractChannelControl } from '@voiceflow/socket-utils';

import { LoguxControlOptions } from '@/control';

// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractChannelControl<P extends object, D extends object = {}> extends BaseAbstractChannelControl<LoguxControlOptions, P, D> {}
