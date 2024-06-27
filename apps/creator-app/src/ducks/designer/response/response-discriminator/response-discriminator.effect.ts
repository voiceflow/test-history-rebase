import { Actions } from '@voiceflow/sdk-logux-designer';

import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const patchOne =
  (id: string, patch: Actions.ResponseDiscriminator.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseDiscriminator.PatchOne({ id, patch, context }));
  };
