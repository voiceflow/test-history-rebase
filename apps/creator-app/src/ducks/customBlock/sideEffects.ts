import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import * as CreatorV2 from '@/ducks/creatorV2';
import { allCustomBlocksSelector } from '@/ducks/customBlock/selectors';
import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

type CreatePayload = Omit<Realtime.CustomBlock, 'id'>;

export const create =
  (payload: CreatePayload): Thunk<Realtime.CustomBlock> =>
  async (dispatch, getState) => {
    const key = Utils.id.objectID();
    const value = { ...payload, id: key };

    await dispatch.sync(Realtime.customBlock.crud.add({ ...getActiveVersionContext(getState()), key, value }));

    return value;
  };

export const addManyCustomBlocks =
  (values: Realtime.CustomBlock[]): Thunk =>
  async (dispatch, getState) => {
    if (!values.length) return;

    await dispatch.sync(
      Realtime.customBlock.crud.addMany({
        ...getActiveVersionContext(getState()),
        values,
      })
    );
  };

type DeletePayload = Pick<Realtime.CustomBlock, 'id'>;
export const remove =
  (payload: DeletePayload): Thunk<void> =>
  async (dispatch, getState) => {
    const context = getActiveVersionContext(getState());
    const { id } = payload;

    await dispatch.sync(
      Realtime.customBlock.crud.remove({
        key: id,
        ...context,
      })
    );
  };

export const update =
  (payload: Realtime.CustomBlock): Thunk<Realtime.CustomBlock> =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.customBlock.crud.update({
        ...getActiveVersionContext(getState()),
        key: payload.id,
        value: payload,
      })
    );
    return payload;
  };

export const syncCustomBlockPorts = (): Thunk<void> => async (dispatch, getState) => {
  const state = getState();

  const context = getActiveVersionContext(state);
  const activeDiagramID = CreatorV2.activeDiagramIDSelector(state);

  Errors.assertDiagramID(activeDiagramID);

  const allNodes = CreatorV2.allNodeDataSelector(state);
  const allPointers = allNodes.filter(Realtime.Utils.node.isCustomBlockPointer);

  const allCustomBlocks = allCustomBlocksSelector(state);
  const allCustomBlocksMap = new Map(allCustomBlocks.map((block) => [block.id, block]));

  const patchData = allPointers
    .filter((pointer) => allCustomBlocksMap.has(pointer.sourceID))
    .reduce(
      (updatePatch, pointer) => {
        const sourceBlock = allCustomBlocksMap.get(pointer.sourceID)!;
        const existingPorts = CreatorV2.portsByNodeIDSelector(state, { id: pointer.nodeID }).out.dynamic;

        const newPaths = sourceBlock.paths.filter((_, index) => index >= existingPorts.length);

        if (newPaths.length > 0) {
          updatePatch[pointer.nodeID] = newPaths.map((pathname) => ({
            portID: Utils.id.cuid(),
            label: pathname,
          }));
        }

        return updatePatch;
      },
      {} as Record<string, { label: string; portID: string }[]>
    );

  if (Object.keys(patchData).length > 0) {
    await dispatch.sync(Realtime.port.syncCustomBlockPorts({ ...context, diagramID: activeDiagramID, patchData }));
  }
};
