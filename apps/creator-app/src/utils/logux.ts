import { Client } from '@logux/client';
import { Utils } from '@voiceflow/common';
import { Action, AsyncActionCreators } from 'typescript-fsa';

import { getActionID, wrapOwnAction } from '@/store/utils';

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

export const waitAsyncAction = async <T, R, E extends Utils.protocol.AsyncError<number>>(
  client: Client,
  actionCreators: AsyncActionCreators<T, R, E>,
  payload: T
): Promise<R> => {
  let unsubscribe: VoidFunction | null = null;

  try {
    const processedActions: Action<R | E>[] = [];
    const actionID = Utils.id.cuid();
    const action = actionCreators.started(payload);

    const unsubscribeFailed = client.type<Action<E>>(actionCreators.failed.type, (action) => processedActions.push(action));
    const unsubscribeProcessed = client.type<Action<R>>(actionCreators.done.type, (action) => processedActions.push(action));

    unsubscribe = () => {
      unsubscribeFailed();
      unsubscribeProcessed();
    };

    await client.sync(wrapOwnAction(action, client.nodeId, actionID));

    unsubscribe();
    unsubscribe = null;

    const processedAction = processedActions.find((action) => getActionID(action) === actionID);

    if (processedAction && actionCreators.failed.match(processedAction)) {
      throw new AsyncActionError<E>(processedAction.payload.error);
    }

    if (processedAction && actionCreators.done.match(processedAction)) {
      return processedAction.payload.result!;
    }
  } finally {
    unsubscribe?.();
  }

  throw new Error('no response action found');
};
