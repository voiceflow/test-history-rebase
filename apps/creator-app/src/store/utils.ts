import { AnyRecord, Utils } from '@voiceflow/common';
import * as UI from '@voiceflow/ui';
import { Action, AnyAction } from 'typescript-fsa';

import { Dispatch, Dispatchable, Store } from './types';

const ORIGIN_KEY = 'origin';
const LOGUX_ACTION_PREFIX = 'logux/';
export const ACTION_ID_KEY = 'actionID';

export const storeLogger = UI.logger.child('store');

export const wrapDispatch = (getStore: () => Store): Dispatch =>
  Object.assign(<T extends UI.AnyAction>(action: T) => getStore().dispatch(action), {
    sync: <T extends AnyAction>(action: T) => getStore().dispatch.sync(action),
    local: <T extends AnyAction>(action: T) => getStore().dispatch.local(action),
    crossTab: <T extends AnyAction>(action: T) => getStore().dispatch.crossTab(action),
    getNodeID: () => getStore().client.nodeId,
    partialSync: <T extends AnyAction>(action: T) => getStore().dispatch.partialSync(action),
  });

export const extendMeta = <T extends Action<any>>(action: T, meta: AnyRecord): T => ({
  ...action,
  meta: {
    ...meta,
    // keeping this last to avoid overwriting meta defined during action creation
    ...action.meta,
  },
});

export const wrapOwnAction = <T extends Action<any>>(action: T, origin: string, actionID = Utils.id.cuid()) =>
  action.type.startsWith(LOGUX_ACTION_PREFIX) ? action : extendMeta(action, { [ORIGIN_KEY]: origin, [ACTION_ID_KEY]: actionID });

export const getActionOrigin = (action: Action<any>): string | null => action.meta?.[ORIGIN_KEY] ?? null;

export const getActionID = (action: Action<any>): string | null => action.meta?.[ACTION_ID_KEY] ?? null;

export const rewriteDispatch = (store: Store): Dispatch => {
  const addOrigin =
    <T extends AnyAction, R>(dispatch: (action: T) => R) =>
    (action: T): R =>
      dispatch(wrapOwnAction(action as any, store.client.nodeId));

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
      partialSync: addOrigin(store.dispatch.partialSync),
    },
    { getNodeID: () => store.client.nodeId }
  );

  return dispatch;
};
