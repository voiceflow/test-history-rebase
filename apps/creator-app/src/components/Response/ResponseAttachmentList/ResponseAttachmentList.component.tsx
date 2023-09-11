import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { ResponseAttachment } from '../ResponseAttachment/ResponseAttachment.component';
import type { IResponseAttachmentList } from './ResponseAttachmentList.interface';

export const ResponseAttachmentList: React.FC<IResponseAttachmentList> = ({ onRemove, attachments, onAttachmentSelect, onAttachmentDuplicate }) => {
  if (!attachments.length) return null;

  return (
    <Box pt={4} pl={12} mr={-8} gap={4} direction="column">
      {attachments.map(({ id, attachment }) => (
        <ResponseAttachment
          key={id}
          onRemove={() => onRemove(id)}
          attachment={attachment}
          onAttachmentSelect={onAttachmentSelect}
          onAttachmentDuplicate={onAttachmentDuplicate}
        />
      ))}
    </Box>
  );
};
