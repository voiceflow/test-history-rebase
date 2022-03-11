import * as Realtime from '@voiceflow/realtime-sdk';

import { Thunk } from '@/store/types';

import { getActiveVersionContext } from '../../utils';

export const reorderTopics =
  (from: number, to: number): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.reorderTopics({ ...getActiveVersionContext(getState()), from, to }));
  };

export const reorderComponents =
  (from: number, to: number): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.reorderComponents({ ...getActiveVersionContext(getState()), from, to }));
  };
