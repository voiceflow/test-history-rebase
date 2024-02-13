import type { Function as FunctionType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { DataTypes, download } from '@voiceflow/ui';
import { notify } from '@voiceflow/ui-next';

import { designerClient } from '@/client/designer';
import { testFunction } from '@/client/generalRuntime';
import type { FunctionTestResponse } from '@/client/generalRuntime/types';
import { realtimeClient } from '@/client/realtime';
import * as Tracking from '@/ducks/tracking';
import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import * as date from '@/utils/date';

import * as FunctionSelect from './function.select';
import * as FunctionPathSelect from './function-path/function-path.select';
import * as FunctionVariableSelect from './function-variable/function-variable.select';

export const createOne =
  (data: Actions.Function.CreateData): Thunk<FunctionType> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    try {
      const response = await dispatch(waitAsync(Actions.Function.CreateOne, { context, data }));

      dispatch(Tracking.trackCMSFunctionCreated({ functionID: response.data.id }));

      return response.data;
    } catch (e) {
      dispatch(Tracking.trackCMSFunctionsError({ ErrorType: 'Create' }));
      throw e;
    }
  };

export const duplicateOne =
  (functionID: string): Thunk<Actions.Function.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    try {
      const duplicated = await dispatch(waitAsync(Actions.Function.DuplicateOne, { context, data: { functionID } }));

      notify.short.success('Duplicated');

      dispatch(Tracking.trackCMSFunctionDuplicated({ functionID }));

      return duplicated.data;
    } catch (e) {
      dispatch(Tracking.trackCMSFunctionsError({ ErrorType: 'Duplicate' }));
      throw e;
    }
  };

export const patchOne =
  (id: string, patch: Actions.Function.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.PatchOne({ context, id, patch }));
  };

export const patchMany =
  (ids: string[], patch: Actions.Function.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.PatchMany({ context, ids, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.DeleteOne({ context, id }));

    dispatch(Tracking.trackCMSFunctionsDeleted({ count: 1 }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.DeleteMany({ context, ids }));

    dispatch(Tracking.trackCMSFunctionsDeleted({ count: ids.length }));
  };

export const exportMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const dateNow = date.toYYYYMMDD(new Date());
      const currentFunction = FunctionSelect.getOneByID(state)({ id: ids[0] });
      const fileName = ids.length > 1 ? 'bulk_functions' : currentFunction!.name.replace(/ /g, '_');

      const context = getActiveAssistantContext(state);

      const result = await designerClient.function.exportJSON(context.environmentID, { ids });

      dispatch(Tracking.trackCMSFunctionsExported({ count: ids.length }));

      download(`${fileName}_${dateNow}.json`, JSON.stringify(result), DataTypes.JSON);
    } catch {
      notify.short.error('Something went wrong. Please try again.');
      dispatch(Tracking.trackCMSFunctionsError({ ErrorType: 'Export' }));
    }
  };

export const importMany =
  (file: File): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    try {
      const { functions } = await designerClient.function.importFile(context.environmentID, {
        file,
        clientID: realtimeClient.clientId,
      });

      if (!functions.length) {
        notify.short.error('Failed to import');
        dispatch(Tracking.trackCMSFunctionsError({ ErrorType: 'Import' }));

        return;
      }

      notify.short.success('Imported');

      const trackingName = functions.length === 1 ? { function_name: functions[0].name } : { function_names: functions.map((func) => func.name) };

      if (functions.length) {
        dispatch(Tracking.trackCMSFunctionsImported({ count: functions.length, ...trackingName }));
      }
    } catch {
      notify.short.error('Failed to import');
      dispatch(Tracking.trackCMSFunctionsError({ ErrorType: 'Import' }));
    }
  };

export const testOne =
  (functionID: string, inputVars: Record<string, string>): Thunk<FunctionTestResponse> =>
  async (_dispatch, getState) => {
    const state = getState();

    const inputVariables = FunctionVariableSelect.inputByFunctionID(state, { functionID });
    const outVariables = FunctionVariableSelect.outputByFunctionID(state, { functionID });
    const paths = FunctionPathSelect.allByFunctionID(state, { functionID });
    const functionData = FunctionSelect.oneByID(state, { id: functionID })!;

    return testFunction({
      definition: {
        code: functionData.code,
        pathCodes: paths.map((path) => path.name),
        inputVars: inputVariables.reduce((acc, { name }) => ({ ...acc, [name]: { type: 'string' } }), {}),
        outputVars: outVariables.reduce((acc, { name }) => ({ ...acc, [name]: { type: 'string' } }), {}),
      },
      invocation: {
        inputVars,
      },
    });
  };
