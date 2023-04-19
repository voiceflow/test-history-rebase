import { Nullable } from '@voiceflow/common';
import { Action, ActionCreator } from 'typescript-fsa';

import type { GetState } from '@/store/types';
import { extendMeta } from '@/store/utils';

export const REPLAY_KEY = Symbol('replay');
export const BATCH_KEY = Symbol('batch');

export interface ActionReverter<Payload> {
  actionCreator: ActionCreator<Payload>;
  revert: (payload: Payload, getState: GetState) => Nullable<Action<any>> | Nullable<Action<any>>[];
  invalidators: ActionInvalidator<Payload, any>[];
}

export interface ActionInvalidator<Origin, Payload> {
  actionCreator: ActionCreator<Payload>;
  invalidate: (origin: Origin, subject: Payload) => boolean;
}

export const createInvalidator = <Origin, Payload>(
  actionCreator: ActionCreator<Payload>,
  invalidate: (origin: Origin, subject: Payload) => boolean
): ActionInvalidator<Origin, Payload> => ({ actionCreator, invalidate });

export const createReverter = <Payload>(
  actionCreator: ActionCreator<Payload>,
  revert: (payload: Payload, getState: GetState) => Nullable<Action<any>> | Nullable<Action<any>>[],
  invalidators: ActionInvalidator<Payload, any>[] = []
): ActionReverter<Payload> => ({
  actionCreator,
  revert,
  invalidators,
});

export const wrapReplayAction = <T extends Action<any>>(action: T) => extendMeta(action, { [REPLAY_KEY]: true });

export const wrapBatchAction = <T extends Action<any>>(action: T) => extendMeta(action, { [BATCH_KEY]: true });

export const isReplayAction = (action: Action<any> & { meta?: any }) => !!action?.meta[REPLAY_KEY];

export const isBatchAction = (action: Action<any> & { meta?: any }) => !!action?.meta[BATCH_KEY];
