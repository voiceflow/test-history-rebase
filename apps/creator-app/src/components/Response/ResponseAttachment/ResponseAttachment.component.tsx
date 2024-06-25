import { AttachmentType } from '@voiceflow/dtos';
import React from 'react';
import { match } from 'ts-pattern';

import { ResponseCardAttachment } from '../ResponseCardAttachment/ResponseCardAttachment.component';
import { ResponseMediaAttachment } from '../ResponseMediaAttachment/ResponseMediaAttachment.component';
import type { IResponseAttachment } from './ResponseAttachment.interface';

export const ResponseAttachment: React.FC<IResponseAttachment> = ({ attachment, ...props }) =>
  match(attachment)
    .with({ type: AttachmentType.MEDIA }, (attachment) => (
      <ResponseMediaAttachment {...props} attachment={attachment} />
    ))
    .with({ type: AttachmentType.CARD }, (attachment) => <ResponseCardAttachment {...props} attachment={attachment} />)
    .exhaustive();
