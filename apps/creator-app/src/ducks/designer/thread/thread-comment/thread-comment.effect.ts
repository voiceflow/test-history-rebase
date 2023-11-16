import type { ThreadComment } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import * as Account from '@/ducks/account';
import { waitAsync } from '@/ducks/utils';
import { getLegacyActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (threadID: string, data: Pick<Actions.ThreadComment.CreateData, 'text' | 'mentions'>): Thunk<ThreadComment> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.ThreadComment.CreateOne, {
        data: { ...data, threadID, authorID: Account.userIDSelector(state)! },
        context: getLegacyActiveAssistantContext(state),
      })
    );

    return response.data;
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.ThreadComment.DeleteOne({ id, context: getLegacyActiveAssistantContext(state) }));
  };
