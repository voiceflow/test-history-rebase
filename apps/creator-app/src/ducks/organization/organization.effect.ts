import { Actions } from '@voiceflow/sdk-logux-designer';
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
    const workspaceID = WorkspaceV2.active.workspaceSelector(state)?.id;

    Errors.assertOrganizationID(organizationID);
    Errors.assertWorkspaceID(workspaceID);

    try {
      await dispatch.sync(
        Actions.Organization.PatchOne({ id: organizationID, patch: { name }, context: { organizationID, workspaceID } })
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid organization name'));
    }
  };

export const updateActiveOrganizationImage =
  (formData: FormData): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);
    const workspaceID = WorkspaceV2.active.workspaceSelector(state)?.id;

    Errors.assertOrganizationID(organizationID);
    Errors.assertWorkspaceID(workspaceID);

    try {
      // TODO: [organization refactor] move this to organization http endpoint
      const { image } = await client.identity.organization.updateImage(organizationID, formData);
      await dispatch.sync(
        Actions.Organization.PatchOne({
          id: organizationID,
          patch: { image },
          context: { organizationID, workspaceID },
        })
      );

      return image;
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update image"));

      throw err;
    }
  };
