import * as UI from '@voiceflow/ui';
import { AnyAction } from 'typescript-fsa';

import { Dispatch, Store } from './types';

export const storeLogger = UI.logger.child('store');

export const wrapDispatch = (getStore: () => Store): Dispatch =>
  Object.assign(<T extends UI.AnyAction>(action: T) => getStore().dispatch(action), {
    sync: <T extends AnyAction>(action: T) => getStore().dispatch.sync(action),
    local: <T extends AnyAction>(action: T) => getStore().dispatch.local(action),
    crossTab: <T extends AnyAction>(action: T) => getStore().dispatch.crossTab(action),
    getNodeID: () => getStore().client.nodeId,
  });
