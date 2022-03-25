import * as Realtime from '@voiceflow/realtime-sdk';

import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

// eslint-disable-next-line import/prefer-default-export
export const upsertNote =
  (note: Realtime.Note): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.note.upsert({ ...getActiveVersionContext(getState()), note }));
  };
