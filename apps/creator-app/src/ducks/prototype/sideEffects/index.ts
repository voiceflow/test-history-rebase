import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui-next';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { updatePrototypeSettings } from '../actions';
import { prototypeSettingsSelector } from '../selectors';

export { default as checkSharedProtoPassword } from './checkSharedProtoPassword';
export { default as compilePrototype } from './compilePrototype';
export { default as fetchContext } from './fetchContext';
export type { ResetOptions } from './reset';
export { default as resetPrototype } from './reset';
export { default as setupPublicPrototype } from './setupPublicPrototype';
export { default as startPrototype } from './startPrototype';
export { default as startPublicPrototype } from './startPublicPrototype';

export const updateSharePrototypeSettings =
  (data: Partial<Realtime.PrototypeSettings>): Thunk =>
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
