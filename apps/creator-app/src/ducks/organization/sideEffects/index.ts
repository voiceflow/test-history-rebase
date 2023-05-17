import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

export const updateActiveOrganizationName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);

    Errors.assertOrganizationID(organizationID);

    try {
      await dispatch.sync(Realtime.organization.updateName({ organizationID, name }));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid organization name'));
    }
  };

export const updateActiveOrganizationImage =
  (formData: FormData): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);

    Errors.assertOrganizationID(organizationID);

    try {
      const { image } = await client.identity.organization.updateImage(organizationID, formData);
      await dispatch.sync(Realtime.organization.updateImage({ organizationID, image }));

      return image;
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update image"));

      throw err;
    }
  };

export const removeActiveOrganizationAdmin =
  (creatorID: number): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);

    Errors.assertOrganizationID(organizationID);

    try {
      await dispatch.sync(Realtime.organization.member.remove({ organizationID, creatorID }));
    } catch (err) {
      toast.genericError();
    }
  };
