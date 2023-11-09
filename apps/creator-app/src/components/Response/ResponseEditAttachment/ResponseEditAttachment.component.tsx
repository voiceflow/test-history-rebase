import { AttachmentType } from '@voiceflow/dtos';
import React from 'react';
import { match } from 'ts-pattern';

import { ResponseEditCardAttachment } from '../ResponseEditCardAttachment/ResponseEditCardAttachment.component';
import { ResponseEditMediaAttachment } from '../ResponseEditMediaAttachment/ResponseEditMediaAttachment.component';
import type { IResponseEditAttachment } from './ResponseEditAttachment.interface';

export const ResponseEditAttachment: React.FC<IResponseEditAttachment> = ({ attachment, ...props }) =>
  match(attachment)
    .with({ type: AttachmentType.MEDIA }, (attachment) => <ResponseEditMediaAttachment {...props} attachment={attachment} />)
    .with({ type: AttachmentType.CARD }, (attachment) => <ResponseEditCardAttachment {...props} attachment={attachment} />)
    .exhaustive();
