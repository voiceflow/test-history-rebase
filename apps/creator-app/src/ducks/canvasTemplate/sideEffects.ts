import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import { waitAsync } from '@/ducks/utils';
import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createCanvasTemplate =
  ({
    name,
    color,
    nodeIDs,
  }: {
    name: string;
    color: string | null;
    nodeIDs: string[];
  }): Thunk<Realtime.CanvasTemplate> =>
  async (dispatch, getState) => {
    const state = getState();

    try {
      return dispatch(
        waitAsync(Realtime.canvasTemplate.create, {
          ...getActiveVersionContext(state),
          canvasTemplate: { id: Utils.id.cuid.slug(), name, color, nodeIDs },
        })
      );
    } catch (e) {
      toast.genericError();
      throw e;
    }
  };

export const updateCanvasTemplate =
  (canvasTemplateID: string, data: Realtime.canvasTemplate.PatchCanvasTemplatePayload): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.canvasTemplate.crud.patch({ ...getActiveVersionContext(getState()), key: canvasTemplateID, value: data })
    );
  };

export const deleteCanvasTemplate =
  (canvasTemplateID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(
      Realtime.canvasTemplate.crud.remove({ ...getActiveVersionContext(state), key: canvasTemplateID })
    );
  };
