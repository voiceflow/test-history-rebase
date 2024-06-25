import { AttachmentType } from '@voiceflow/dtos';
import React from 'react';
import { match } from 'ts-pattern';

import { MediaLibraryMediaAttachmentPreview } from '../MediaLibraryMediaAttachmentPreview/MediaLibraryMediaAttachmentPreview.component';
import type { IMediaLibraryAttachmentPreview } from './MediaLibraryAttachmentPreview.interface';

export const MediaLibraryAttachmentPreview: React.FC<IMediaLibraryAttachmentPreview> = ({ attachment }) =>
  match(attachment)
    .with({ type: AttachmentType.MEDIA }, (attachment) => (
      <MediaLibraryMediaAttachmentPreview attachment={attachment} />
    ))
    // TODO: add card attachment
    .with({ type: AttachmentType.CARD }, () => null)
    .exhaustive();
