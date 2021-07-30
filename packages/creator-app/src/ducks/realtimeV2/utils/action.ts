import * as Realtime from '@voiceflow/realtime-sdk';
import cuid from 'cuid';
import { Action } from 'typescript-fsa';

import { getRealtimeStore } from '@/store/realtime';
import { createControlledPromise } from '@/utils/promise';

// eslint-disable-next-line import/prefer-default-export
export const waitActionProcessed = async <T>(action: Action<any>): Promise<T> => {
  const promise = createControlledPromise<T>();

  const store = getRealtimeStore();

  let unsubscribe: VoidFunction | null = null;

  try {
    const processedActions: Action<Realtime.creator.ActionProcessedPayload>[] = [];
    const actionID = cuid();

    unsubscribe = store.log.type<Action<Realtime.creator.ActionProcessedPayload<T>>>(Realtime.creator.actionProcessed.type, (action) =>
      processedActions.push(action)
    );

    await store.dispatch.sync({ ...action, meta: { ...action.meta, actionID } });

    const processedAction = processedActions.find((action) => action.payload.actionID === actionID)!;

    return processedAction.payload.data;
  } catch (error) {
    unsubscribe?.();
    promise.reject(error);
  }

  return promise;
};
