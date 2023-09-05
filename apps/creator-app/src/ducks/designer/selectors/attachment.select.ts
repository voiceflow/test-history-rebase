import type { AnyAttachment, AnyResponseAttachment } from '@voiceflow/sdk-logux-designer';
import { createSelector } from 'reselect';

import { isCardResponseAttachment } from '@/utils/response.util';

import { getOneByID as getAttachmentByID } from '../attachment/attachment.select';
import { allByIDs as allResponseAttachmentByIDs } from '../response/response-attachment/response-attachment.select';

export const allResponseAttachmentWithAttachmentByIDs = createSelector(
  allResponseAttachmentByIDs,
  getAttachmentByID,
  (responseAttachments, getOneByID) =>
    responseAttachments
      .map((responseAttachment) => ({
        ...responseAttachment,
        attachment: isCardResponseAttachment(responseAttachment)
          ? getOneByID({ id: responseAttachment.cardID })
          : getOneByID({ id: responseAttachment.mediaID }),
      }))
      .filter((result): result is AnyResponseAttachment & { attachment: AnyAttachment } => !!result.attachment)
);
