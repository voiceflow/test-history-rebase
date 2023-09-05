import { Actions } from '@voiceflow/sdk-logux-designer';

import type { Thunk } from '@/store/types';

export const patchOne =
  (id: string, patch: Actions.Event.PatchData): Thunk =>
  async (dispatch) => {
    await dispatch.sync(Actions.Event.PatchOne({ id, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch) => {
    await dispatch.sync(Actions.Event.DeleteOne({ id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch) => {
    await dispatch.sync(Actions.Event.DeleteMany({ ids }));
  };
