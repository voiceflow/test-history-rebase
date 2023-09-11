import { MediaDatatype } from '@voiceflow/sdk-logux-designer';
import { Image, ImagePreview } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { markupToString } from '@/utils/markup.util';
import { containsVariable } from '@/utils/string.util';

import type { IMediaLibraryMediaAttachmentPreview } from './MediaLibraryMediaAttachmentPreview.interface';

export const MediaLibraryMediaAttachmentPreview: React.FC<IMediaLibraryMediaAttachmentPreview> = ({ attachment }) => {
  const [previewURL, previewURLContainsVars] = useMemo(() => {
    if (attachment.datatype !== MediaDatatype.IMAGE) return ['', false];

    const url = markupToString.fromDB(attachment.url, { variablesMapByID: {}, entitiesMapByID: {} });

    return [url, containsVariable(url)];
  }, [attachment.url, attachment.type]);

  if (!previewURL || previewURLContainsVars) return <Image.Placeholder />;

  return (
    <ImagePreview
      image={previewURL}
      referenceElement={({ ref, onOpen, onClose }) => (
        <div ref={ref}>
          <Image src={previewURL} onMouseEnter={onOpen} onMouseLeave={onClose} />
        </div>
      )}
    />
  );
};
