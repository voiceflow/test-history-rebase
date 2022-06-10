import { Utils } from '@voiceflow/common';
import { Action, AsyncActionCreators } from 'typescript-fsa';

import { Thunk } from '@/store/types';
import { extendMeta } from '@/store/utils';

type ErrorCode<T> = T extends Utils.protocol.AsyncError<infer R> ? R : never;

export class AsyncActionError<T extends Utils.protocol.AsyncError<number>> extends Error {
  code: ErrorCode<T> | null = null;

  constructor(data: T) {
    super(data.message);

    if (data.code != null) {
      this.code = data.code as ErrorCode<T>;
    }
  }
}

export const waitAsync =
  <T, R, E extends Utils.protocol.AsyncError<number>>(actionCreators: AsyncActionCreators<T, R, E>, payload: T): Thunk<R> =>
  async (dispatch, _getState, { log }) => {
    const promise = Utils.promise.createControlledPromise<R>();

    let unsubscribe: VoidFunction | null = null;

    try {
      const processedActions: Action<R | E>[] = [];
      const actionID = Utils.id.cuid();
      const action = actionCreators.started(payload);

      const unsubscribeProcessed = log.type<Action<E>>(actionCreators.done.type, (action) => processedActions.push(action));
      const unsubscribeFailed = log.type<Action<R>>(actionCreators.failed.type, (action) => processedActions.push(action));

      unsubscribe = () => {
        unsubscribeProcessed();
        unsubscribeFailed();
      };

      await dispatch.sync(extendMeta(action, { actionID }));
      unsubscribe();

      const processedAction = processedActions.find((action) => action.meta?.actionID === actionID)!;

      if (actionCreators.failed.match(processedAction)) {
        promise.reject(new AsyncActionError<E>(processedAction.payload.error));
        return promise;
      }

      if (actionCreators.done.match(processedAction)) {
        promise.resolve(processedAction.payload.result!);
        return promise;
      }

      unsubscribe?.();
      promise.reject(new Error('no response action found'));
    } catch (error) {
      unsubscribe?.();
      promise.reject(error);
    }

    return promise;
  };
