import cuid from 'cuid';
import { Action, AsyncActionCreators } from 'typescript-fsa';

import { Thunk } from '@/store/types';
import { createControlledPromise } from '@/utils/promise';

// eslint-disable-next-line import/prefer-default-export
export const waitAsync =
  <T, R, E = {}>(actionCreators: AsyncActionCreators<T, R, E>, payload: T): Thunk<R> =>
  async (dispatch, _getState, { log }) => {
    const promise = createControlledPromise<R>();

    let unsubscribe: VoidFunction | null = null;

    try {
      const processedActions: Action<R | E>[] = [];
      const actionID = cuid();
      const action = actionCreators.started(payload);

      const unsubscribeProcessed = log.type<Action<E>>(actionCreators.done.type, (action) => processedActions.push(action));
      const unsubscribeFailed = log.type<Action<R>>(actionCreators.failed.type, (action) => processedActions.push(action));

      unsubscribe = () => {
        unsubscribeProcessed();
        unsubscribeFailed();
      };

      await dispatch.sync({ ...action, meta: { ...action.meta, actionID } });
      unsubscribe();

      const processedAction = processedActions.find((action) => action.meta?.actionID === actionID)!;

      if (actionCreators.failed.match(processedAction)) {
        promise.reject(processedAction.payload.error);
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
