import type { CardAttachment, Markup, MediaAttachment } from '@voiceflow/dtos';
import { MediaDatatype } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import { designerClient } from '@/client/designer';
import { realtimeClient } from '@/client/realtime';
import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

export const createOneCard =
  (data: Actions.Attachment.CreateCardData): Thunk<CardAttachment> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.Attachment.CreateCardOne, {
        data,
        context,
      })
    );

    return response.data;
  };

export const patchOneCard =
  (id: string, data: Actions.Attachment.PatchCardData): Thunk<void> =>
  async (dispatch, getState) => {
    try {
      await dispatch.sync(
        Actions.Attachment.PatchOneCard({
          id,
          patch: data,
          context: getActiveAssistantContext(getState()),
        })
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update card'));

      throw err;
    }
  };

export const uploadImage =
  (image: File): Thunk<{ url: string; attachmentID: string }> =>
  (_dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    return designerClient.upload.assistantImage(context.assistantID, { image, clientID: realtimeClient.clientId });
  };

export const createImageFromURL =
  (url: Markup): Thunk<MediaAttachment> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.Attachment.CreateMediaOne, {
        data: { url, name: 'image', isAsset: false, datatype: MediaDatatype.IMAGE },
        context,
      })
    );

    return response.data;
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Attachment.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Attachment.DeleteMany({ context, ids }));
  };
