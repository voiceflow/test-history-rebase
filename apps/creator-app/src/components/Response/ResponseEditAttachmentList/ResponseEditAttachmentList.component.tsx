import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { ResponseEditAttachment } from '../ResponseEditAttachment/ResponseEditAttachment.component';
import type { IResponseEditAttachmentList } from './ResponseEditAttachmentList.interface';

export const ResponseEditAttachmentList: React.FC<IResponseEditAttachmentList> = ({ variant }) => {
  const deleteResponseAttachment = useDispatch(Designer.Response.ResponseAttachment.effect.deleteOne);

  const responseAttachments = useSelector(Designer.selectors.allResponseAttachmentWithAttachmentByIDs, {
    ids: variant.attachmentOrder,
  });

  if (!responseAttachments.length) return null;

  return (
    <Box pt={4} pl={12} mr={-8} gap={4} direction="column">
      {responseAttachments.map(({ id, attachment }) => (
        <ResponseEditAttachment
          key={id}
          onRemove={() => deleteResponseAttachment(id)}
          variantID={variant.id}
          attachment={attachment}
          responseAttachmentID={id}
        />
      ))}
    </Box>
  );
};
