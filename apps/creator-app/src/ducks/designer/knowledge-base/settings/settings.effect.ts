import type { KnowledgeBaseSettings } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { notify } from '@voiceflow/ui-next';

import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const patch =
  (patch: Partial<KnowledgeBaseSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const context = getActiveAssistantContext(state);

    try {
      await dispatch.sync(Actions.KnowledgeBaseSettings.Patch({ data: patch, context }));
    } catch {
      notify.short.error('Unable to save Knowledge Base settings');
    }
  };
