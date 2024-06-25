import type { Utils } from '@voiceflow/common';
import type { AsyncActionCreators } from 'typescript-fsa';

import type { Thunk } from '@/store/types';
import { waitAsyncAction } from '@/utils/logux';

export const waitAsync =
  <T, R, E extends Utils.protocol.AsyncError<number>>(
    actionCreators: AsyncActionCreators<T, R, E>,
    payload: T
  ): Thunk<R> =>
  async (_dispatch, _getState, { client }) =>
    waitAsyncAction(client, actionCreators, payload);
