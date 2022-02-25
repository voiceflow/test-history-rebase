import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import { PrototypeMode } from '@/constants/prototype';
import * as Session from '@/ducks/session';
import { SyncThunk, Thunk } from '@/store/types';

import { updatePrototypeMode, updatePrototypeSettings } from '../actions';
import { prototypeSettingsSelector } from '../selectors';
import { PrototypeShareViewSettings } from '../types';

export { default as checkSharedProtoPassword } from './checkSharedProtoPassword';
export { default as compilePrototype } from './compilePrototype';
export { default as fetchContext } from './fetchContext';
export { default as resetPrototype } from './reset';
export { default as setupPublicPrototype } from './setupPublicPrototype';
export { default as startPrototype } from './start';
export { default as validateModel } from './validateModel';

export const updateActivePrototypeMode =
  (mode: PrototypeMode): SyncThunk =>
  (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    dispatch(updatePrototypeMode(projectID, mode));
  };

export const updateSharePrototypeSettings =
  (data: Partial<PrototypeShareViewSettings>): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());
    const currentState = prototypeSettingsSelector(getState());

    Errors.assertVersionID(versionID);

    try {
      dispatch(updatePrototypeSettings(data));
      await client.api.version.updatePrototypeSettings(versionID, data);
    } catch (e) {
      // revert to current state if update fails;
      dispatch(updatePrototypeSettings(currentState));
      toast.genericError();
    }
  };
