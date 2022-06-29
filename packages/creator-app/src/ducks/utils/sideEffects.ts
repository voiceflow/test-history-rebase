import { Utils } from '@voiceflow/common';
import { AsyncActionCreators } from 'typescript-fsa';

import { Thunk } from '@/store/types';
import { waitAsyncAction } from '@/utils/logux';

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
  async (_dispatch, _getState, { client }) =>
    waitAsyncAction(client, actionCreators, payload);
