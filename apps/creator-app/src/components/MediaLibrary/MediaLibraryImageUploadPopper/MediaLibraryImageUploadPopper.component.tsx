import { Surface } from '@voiceflow/ui-next';
import React from 'react';

import { MediaLibraryImageUploader } from '../MediaLibraryImageUploader/MediaLibraryImageUploader.component';
import type { IMediaLibraryImageUploader } from '../MediaLibraryImageUploader/MediaLibraryImageUploader.interface';

export const MediaLibraryImageUploadPopper: React.FC<IMediaLibraryImageUploader> = ({
  onClose,
  imageUrl,
  onImageSelect,
  onLibraryClick,
}) => {
  return (
    <Surface width="300px" pt={16} pb={24} px={24}>
      <MediaLibraryImageUploader
        onClose={onClose}
        imageUrl={imageUrl}
        onImageSelect={onImageSelect}
        onLibraryClick={onLibraryClick}
      />
    </Surface>
  );
};
