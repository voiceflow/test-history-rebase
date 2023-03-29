import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { openError } from '@/ModalsV2/utils';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

export const updateActiveOrganizationName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const organizationID = WorkspaceV2.active.workspaceSelector(state)?.organizationID;

      Errors.assertOrganizationID(organizationID);

      await dispatch.sync(Realtime.organization.updateName({ organizationID, name }));
    } catch (err) {
      openError({ error: getErrorMessage(err, 'Invalid Organization Name') });

      throw err;
    }
  };

export const updateActiveOrganizationImage =
  (formData: FormData): Thunk<string> =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const organizationID = WorkspaceV2.active.workspaceSelector(state)?.organizationID;

      Errors.assertOrganizationID(organizationID);

      const { image } = await client.identity.organization.updateImage(organizationID, formData);
      await dispatch.sync(Realtime.organization.updateImage({ organizationID, image }));

      return image;
    } catch (err) {
      openError({ error: 'Error updating organization image' });

      throw err;
    }
  };
