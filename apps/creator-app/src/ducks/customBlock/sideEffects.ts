import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { allCustomBlocksSelector } from '@/ducks/customBlock/selectors';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

type CreatePayload = Omit<Realtime.CustomBlock, 'id' | 'projectID'>;
export const create =
  (payload: CreatePayload): Thunk<Realtime.CustomBlock> =>
  async (dispatch, getState) => {
    const context = getActiveVersionContext(getState());

    return dispatch(
      waitAsync(Realtime.customBlock.create, {
        ...context,
        ...payload,
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
      Realtime.customBlock.remove({
        id,
        ...context,
      })
    );
  };

type UpdatePayload = Omit<Realtime.CustomBlock, 'projectID'>;
export const update =
  (payload: UpdatePayload): Thunk<Realtime.CustomBlock> =>
  async (dispatch, getState) => {
    const context = getActiveVersionContext(getState());

    return dispatch(
      waitAsync(Realtime.customBlock.update, {
        ...context,
        ...payload,
      })
    );
  };

const isCustomBlockPointer = (block: { type: string }): block is Realtime.NodeData<Realtime.NodeData.Pointer> => {
  return block.type === BlockType.CUSTOM_BLOCK_POINTER;
};

export const syncCustomBlockPorts = (): Thunk<void> => async (dispatch, getState) => {
  const state = getState();

  const context = getActiveVersionContext(state);
  const activeDomainID = Session.activeDomainIDSelector(state);
  const activeDiagramID = CreatorV2.activeDiagramIDSelector(state);

  Errors.assertDomainID(activeDomainID);
  Errors.assertDiagramID(activeDiagramID);

  const allNodes = CreatorV2.allNodeDataSelector(state);
  const allPointers = allNodes.filter(isCustomBlockPointer);

  const allCustomBlocks = allCustomBlocksSelector(state);
  const allCustomBlocksMap = new Map(allCustomBlocks.map((block) => [block.id, block]));

  const patchData = allPointers
    .filter((pointer) => allCustomBlocksMap.has(pointer.sourceID))
    .reduce((updatePatch, pointer) => {
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
    }, {} as Record<string, { label: string; portID: string }[]>);

  if (Object.keys(patchData).length > 0) {
    await dispatch.sync(
      Realtime.port.syncCustomBlockPorts({
        ...context,
        domainID: activeDomainID,
        diagramID: activeDiagramID,
        patchData,
      })
    );
  }
};
