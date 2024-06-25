import type { VersionSettings } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const updateSettings =
  (settings: Partial<VersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Version.UpdateSettings({ context, settings }));
  };
