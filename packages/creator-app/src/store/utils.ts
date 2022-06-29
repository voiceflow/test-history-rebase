import { AnyRecord } from '@voiceflow/common';
import * as UI from '@voiceflow/ui';
import { Action, AnyAction } from 'typescript-fsa';

import { Dispatch, Dispatchable, Store } from './types';

const ORIGIN_KEY = 'origin';

export const storeLogger = UI.logger.child('store');

export const wrapDispatch = (getStore: () => Store): Dispatch =>
  Object.assign(<T extends UI.AnyAction>(action: T) => getStore().dispatch(action), {
    sync: <T extends AnyAction>(action: T) => getStore().dispatch.sync(action),
    local: <T extends AnyAction>(action: T) => getStore().dispatch.local(action),
    crossTab: <T extends AnyAction>(action: T) => getStore().dispatch.crossTab(action),
    getNodeID: () => getStore().client.nodeId,
  });

export const extendMeta = <T extends Action<any>>(action: T, meta: AnyRecord): T => ({ ...action, meta: { ...action.meta, ...meta } });

export const wrapOriginAction = <T extends Action<any>>(action: T, origin: string) => extendMeta(action, { [ORIGIN_KEY]: origin });

export const getActionOrigin = (action: Action<any>): string | null => action.meta?.[ORIGIN_KEY] ?? null;

export const rewriteDispatch = (store: Store): Dispatch => {
  const addOrigin =
    <T extends AnyAction, R>(dispatch: (action: T) => R) =>
    (action: T): R =>
      dispatch(wrapOriginAction(action as any, store.client.nodeId));

  const originalDispatch = addOrigin(store.dispatch);

  // copy sync/crossTab/etc methods from the original dispatch method
  const dispatch = Object.assign(
    (action: Dispatchable) => {
      // thunk handling
      if (typeof action === 'function') {
        return action(dispatch, store.getState, { log: store.log, client: store.client });
      }

      originalDispatch(action as Action<any>);

      return action;
    },
    {
      sync: addOrigin(store.dispatch.sync),
      local: addOrigin(store.dispatch.local),
      crossTab: addOrigin(store.dispatch.crossTab),
    },
    { getNodeID: () => store.client.nodeId }
  );

  return dispatch;
};
