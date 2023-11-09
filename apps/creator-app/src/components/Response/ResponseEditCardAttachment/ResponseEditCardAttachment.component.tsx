import { AttachmentType } from '@voiceflow/dtos';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { markupFactory } from '@/utils/markup.util';

import { ResponseCardAttachment } from '../ResponseCardAttachment/ResponseCardAttachment.component';
import type { IResponseEditCardAttachment } from './ResponseEditCardAttachment.interface';

export const ResponseEditCardAttachment: React.FC<IResponseEditCardAttachment> = ({ onRemove, variantID, attachment, responseAttachmentID }) => {
  const getOneByID = useSelector(Designer.Attachment.selectors.getOneByID);

  const replaceOneCard = useDispatch(Designer.Response.ResponseAttachment.effect.replaceOneCard, variantID);
  const createAttachmentCard = useDispatch(Designer.Attachment.effect.createOneCard);
  const createResponseAttachmentCard = useDispatch(Designer.Response.ResponseAttachment.effect.createOneCard, variantID);

  const onDuplicate = async (attachmentID: string) => {
    const duplicateAttachment = getOneByID({ id: attachmentID });
    const duplicateCard = duplicateAttachment?.type === AttachmentType.CARD ? duplicateAttachment : null;

    const card = await createAttachmentCard({
      title: duplicateCard?.title ?? markupFactory(),
      mediaID: duplicateCard?.mediaID ?? null,
      description: duplicateCard?.description ?? markupFactory(),
      buttonOrder: [],
    });

    await createResponseAttachmentCard({ cardID: card.id });
  };

  return (
    <ResponseCardAttachment
      onRemove={onRemove}
      attachment={attachment}
      onAttachmentSelect={({ id }) => replaceOneCard({ oldCardID: responseAttachmentID, attachmentID: id })}
      onAttachmentDuplicate={onDuplicate}
    />
  );
};
