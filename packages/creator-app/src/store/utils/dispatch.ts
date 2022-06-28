import { LoguxReduxStore } from '@logux/redux';
import { AnyRecord } from '@voiceflow/common';
import * as UI from '@voiceflow/ui';
import { Action, AnyAction } from 'typescript-fsa';

import { Dispatch, Dispatchable, Store } from '../types';

const ORIGIN_KEY = 'origin';

export const wrapDispatch = (getStore: () => Store): Dispatch =>
  Object.assign(<T extends UI.AnyAction>(action: T) => getStore().dispatch(action), {
    sync: <T extends AnyAction>(action: T) => getStore().dispatch.sync(action),
    getNodeID: () => getStore().client.nodeId,
  });

export const extendMeta = <T extends Action<any>>(action: T, meta: AnyRecord): T => ({ ...action, meta: { ...action.meta, ...meta } });

export const wrapOriginAction = <T extends Action<any>>(action: T, origin: string) => extendMeta(action, { [ORIGIN_KEY]: origin });

export const getActionOrigin = (action: Action<any>): string | null => action.meta?.[ORIGIN_KEY] ?? null;

export const rewriteDispatch = (store: LoguxReduxStore): Dispatch => {
  const addOrigin =
    <T extends AnyAction, R>(dispatch: (action: T) => R) =>
    (action: T): R =>
      dispatch(wrapOriginAction(action as any, store.client.nodeId));

  const dispatchLocal = addOrigin(store.dispatch.local);

  // copy sync method from the original logux dispatch
  const dispatch = Object.assign(
    (action: Dispatchable) => {
      // thunk handling
      if (typeof action === 'function') {
        return action(dispatch, store.getState, { log: store.log });
      }

      dispatchLocal(action as Action<any>);

      return action;
    },
    {
      sync: addOrigin(store.dispatch.sync),
    },
    { getNodeID: () => store.client.nodeId }
  );

  return dispatch;
};
