/* eslint-disable @typescript-eslint/ban-types */
import type { LoguxSubscribeAction } from '@logux/actions';
import type { ChannelContext as BaseChannelContext, Context as BaseContext, ServerMeta } from '@logux/server';
import type { Resend } from '@logux/server/base-server';
import type { Eventual } from '@voiceflow/common';
import type { Action } from 'typescript-fsa';

import type { AbstractActionControl } from './control/action';
import type { LoguxControlOptions } from './control/utils';

export type { Resend };

// context types

export interface BaseContextData {
  creatorID: number;
  clientID: string;
}

export type Context<D extends BaseContextData = BaseContextData> = BaseContext<D>;

// action control types

export type ActionAccessor<P, D extends BaseContextData = BaseContextData> = (
  ctx: Context<D>,
  action: Action<P>,
  meta: ServerMeta
) => Eventual<boolean>;

export type BoundActionAccessor<T extends LoguxControlOptions, P, D extends BaseContextData = BaseContextData> = (
  this: AbstractActionControl<T, P, D>,
  ctx: Context<D>,
  action: Action<P>,
  meta: ServerMeta
) => Eventual<boolean>;

export type Resender<P, D extends BaseContextData = BaseContextData> = (
  ctx: Context<D>,
  action: Action<P>,
  meta: ServerMeta
) => Eventual<Resend>;

// channel control types

export type ChannelContext<P extends object, D extends object = {}> = BaseChannelContext<D, P, {}>;

export type ChannelAccessor<P extends object, D extends object = {}> = (ctx: ChannelContext<P, D>) => Eventual<boolean>;

export type ChannelSubscribeAction<E extends object = {}> = LoguxSubscribeAction & E;
