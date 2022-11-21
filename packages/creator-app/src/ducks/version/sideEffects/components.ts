import * as Realtime from '@voiceflow/realtime-sdk';

import { Thunk } from '@/store/types';

import { getActiveVersionContext } from '../utils';

export const reorderComponents =
  ({ fromID, toIndex, skipPersist }: { fromID: string; toIndex: number; skipPersist?: boolean }): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.reorderComponents({ ...getActiveVersionContext(getState()), fromID, toIndex }, { skipPersist }));
  };
