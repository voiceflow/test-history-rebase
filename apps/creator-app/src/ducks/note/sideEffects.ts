import * as Realtime from '@voiceflow/realtime-sdk';

import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import { Thunk } from '@/store/types';

export const upsertNote =
  (note: Realtime.Note): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.note.upsert({ ...getActiveVersionContext(getState()), note }));
  };
