import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { ResponseMediaAttachment } from '../ResponseMediaAttachment/ResponseMediaAttachment.component';
import type { IResponseEditMediaAttachment } from './ResponseEditMediaAttachment.interface';

export const ResponseEditMediaAttachment: React.FC<IResponseEditMediaAttachment> = ({ onRemove, variantID, attachment, responseAttachmentID }) => {
  const createOneMedia = useDispatch(Designer.Response.ResponseAttachment.effect.createOneMedia, variantID);
  const replaceOneMedia = useDispatch(Designer.Response.ResponseAttachment.effect.replaceOneMedia, variantID);

  return (
    <ResponseMediaAttachment
      onRemove={onRemove}
      attachment={attachment}
      onAttachmentSelect={({ id }) => replaceOneMedia({ oldMediaID: responseAttachmentID, attachmentID: id })}
      onAttachmentDuplicate={() => createOneMedia({ mediaID: attachment.id })}
    />
  );
};
