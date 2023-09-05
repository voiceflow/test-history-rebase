import type { CardButton } from '@voiceflow/sdk-logux-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

export const createOne =
  (data: Actions.CardButton.CreateData): Thunk<CardButton> =>
  async (dispatch, getState) => {
    const response = await dispatch(
      waitAsync(Actions.CardButton.Create, {
        data,
        context: getActiveAssistantContext(getState()),
      })
    );
    return response.data;
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.CardButton.DeleteOne({ id, context: getActiveAssistantContext(state) }));
  };

export const patchOne =
  (id: string, data: Actions.CardButton.PatchData): Thunk<void> =>
  async (dispatch, getState) => {
    try {
      await dispatch.sync(
        Actions.CardButton.PatchOne({
          id,
          patch: data,
          context: getActiveAssistantContext(getState()),
        })
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update card button'));

      throw err;
    }
  };
