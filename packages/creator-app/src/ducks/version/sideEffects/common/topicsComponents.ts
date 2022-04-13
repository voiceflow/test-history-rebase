import * as Realtime from '@voiceflow/realtime-sdk';

import { Thunk } from '@/store/types';

import { getActiveVersionContext } from '../../utils';

export const reorderTopics =
  ({ fromID, toIndex, skipPersist }: { fromID: string; toIndex: number; skipPersist?: boolean }): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.reorderTopics({ ...getActiveVersionContext(getState()), fromID, toIndex }, { skipPersist }));
  };

export const reorderComponents =
  (from: number, to: number): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.reorderComponents({ ...getActiveVersionContext(getState()), from, to }));
  };
