import type { Function as FunctionType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { DataTypes, download } from '@voiceflow/ui';
import { notify } from '@voiceflow/ui-next';

import { designerClient } from '@/client/designer';
import { generalRuntimeClient } from '@/client/general-runtime/general-runtime.client';
import type { GeneralRuntimeFunctionTestResponse } from '@/client/general-runtime/general-runtime.interface';
import { realtimeClient } from '@/client/realtime';
import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import * as date from '@/utils/date';

import * as FunctionSelect from './function.select';
import * as FunctionTracking from './function.tracking';
import * as FunctionPathSelect from './function-path/function-path.select';
import * as FunctionVariableSelect from './function-variable/function-variable.select';

export const createOne =
  (data: Actions.Function.CreateData): Thunk<FunctionType> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    try {
      const response = await dispatch(waitAsync(Actions.Function.CreateOne, { context, data }));

      dispatch(FunctionTracking.created({ id: response.data.id }));

      return response.data;
    } catch (e) {
      dispatch(FunctionTracking.error({ errorType: 'Create' }));
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

      dispatch(FunctionTracking.duplicated({ id: functionID }));

      return duplicated.data;
    } catch (e) {
      dispatch(FunctionTracking.error({ errorType: 'Duplicate' }));
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

    dispatch(FunctionTracking.deleted({ count: 1 }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Function.DeleteMany({ context, ids }));

    dispatch(FunctionTracking.deleted({ count: ids.length }));
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

      dispatch(FunctionTracking.exported({ count: ids.length }));

      download(`${fileName}_${dateNow}.json`, JSON.stringify(result), DataTypes.JSON);
    } catch {
      notify.short.error('Something went wrong. Please try again.');
      dispatch(FunctionTracking.error({ errorType: 'Export' }));
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
        dispatch(FunctionTracking.error({ errorType: 'Import' }));

        return;
      }

      notify.short.success('Imported');

      dispatch(FunctionTracking.imported({ names: functions.map((func) => func.name) }));
    } catch {
      notify.short.error('Failed to import');
      dispatch(FunctionTracking.error({ errorType: 'Import' }));
    }
  };

export const testOne =
  (functionID: string, inputVars: Record<string, string>): Thunk<GeneralRuntimeFunctionTestResponse> =>
  async (_dispatch, getState) => {
    const state = getState();

    const inputVariables = FunctionVariableSelect.inputByFunctionID(state, { functionID });
    const outVariables = FunctionVariableSelect.outputByFunctionID(state, { functionID });
    const paths = FunctionPathSelect.allByFunctionID(state, { functionID });
    const functionData = FunctionSelect.oneByID(state, { id: functionID })!;

    return generalRuntimeClient.function.test({
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

export const createOneFromTemplate =
  (templateID: string, name: string, description: string): Thunk<FunctionType> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    try {
      const response = await dispatch(
        waitAsync(Actions.Function.CreateOneFromTemplate, {
          context,
          data: { templateID, name, description },
        })
      );

      dispatch(FunctionTracking.created({ id: response.data.id, templateID }));

      return response.data;
    } catch (err) {
      dispatch(FunctionTracking.error({ errorType: 'Create' }));
      throw err;
    }
  };
