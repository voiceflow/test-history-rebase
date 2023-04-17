/* eslint-disable max-classes-per-file */
import {
  AbstractActionControl as BaseAbstractActionControl,
  AbstractNoopActionControl as BaseAbstractNoopActionControl,
  BaseContextData,
} from '@voiceflow/socket-utils';

import { LoguxControlOptions } from '../control';

export abstract class AbstractActionControl<P, D extends BaseContextData = BaseContextData> extends BaseAbstractActionControl<
  LoguxControlOptions,
  P,
  D
> {}

export abstract class AbstractNoopActionControl<P> extends BaseAbstractNoopActionControl<LoguxControlOptions, P> {}
