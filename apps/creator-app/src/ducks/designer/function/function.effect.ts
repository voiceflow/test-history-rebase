import type { Function as FunctionType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { DataTypes, download } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';

import { designerClient } from '@/client/designer';
import { realtimeClient } from '@/client/realtime';
import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import * as date from '@/utils/date';

import { getOneByID } from './function.select';

export const createOne =
  (data: Actions.Function.CreateData): Thunk<FunctionType> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Function.CreateOne, { context, data }));

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.Function.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.PatchOne({ context, id, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.DeleteMany({ context, ids }));
  };

export const exportMany =
  (ids: string[]): Thunk =>
  async (_dispatch, getState) => {
    try {
      const state = getState();
      const dateNow = date.toYYYYMMDD(new Date());
      const currentFunction = getOneByID(state)({ id: ids[0] });
      const fileName = ids.length > 1 ? 'bulk_functions' : currentFunction!.name.replace(/ /g, '_');

      const context = getActiveAssistantContext(state);

      const result = await designerClient.function.exportJSON(context.environmentID, { ids });

      download(`${fileName}_${dateNow}.json`, JSON.stringify(result), DataTypes.JSON);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

export const importMany =
  (file: File): Thunk =>
  async (_dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    try {
      const { duplicatedFunctions, functions } = await designerClient.function.importFile(context.environmentID, {
        file,
        clientID: realtimeClient.clientId,
      });

      if (duplicatedFunctions.length) {
        duplicatedFunctions.forEach(({ name }) => toast.error(`Failed to import ${name}. You already have this function.`, { autoClose: false }));
      }

      if (functions.length) {
        toast.success('Imported');
      }
    } catch {
      toast.error('Import failed');
    }
  };
