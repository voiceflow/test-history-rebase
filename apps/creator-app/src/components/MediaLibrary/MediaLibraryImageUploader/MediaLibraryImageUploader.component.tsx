import type { Markup } from '@voiceflow/dtos';
import { Box, SquareButton, TabGroup, UploadArea } from '@voiceflow/ui-next';
import { markupToString } from '@voiceflow/utils-designer';
import { deepEqual } from 'fast-equals';
import React, { useMemo, useState } from 'react';

import { Switch } from '@/components/Switch';
import { MEDIA_FILE_TYPES } from '@/constants/media.constant';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { containsVariable } from '@/utils/string.util';

import type { IMediaLibraryImageUploader } from './MediaLibraryImageUploader.interface';
import { MediaLibraryImageUploadURLSection } from './MediaLibraryImageUploadURLSection/MediaLibraryImageUploadURLSection.component';

export const MediaLibraryImageUploader: React.FC<IMediaLibraryImageUploader> = ({ onClose, imageUrl, onImageSelect, onLibraryClick }) => {
  const uploadImage = useDispatch(Designer.Attachment.effect.uploadImage);
  const createImageFromURL = useDispatch(Designer.Attachment.effect.createImageFromURL);

  const [imagePreviewURL, imagePreviewContainsURL] = useMemo(() => {
    const previewURL = imageUrl ? markupToString.fromDB(imageUrl, { variablesMapByID: {}, entitiesMapByID: {} }) : '';

    return [previewURL, containsVariable(previewURL)];
  }, [imageUrl]);

  const [urlError, setURLError] = useState('');
  const [activeTab, setActiveTab] = useState(imagePreviewContainsURL ? 1 : 0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const onUpload = async (files: File[]) => {
    try {
      const file = files[0];
      setUploading(true);

      const { attachmentID } = await uploadImage(file);

      await onImageSelect(attachmentID);

      setUploading(false);
    } catch {
      setUploading(false);
      setUploadError('Unable to upload image.');
    }
  };

  const onUrlSubmit = async (url: Markup) => {
    if (imageUrl && deepEqual(url, imageUrl)) {
      onClose();
      return;
    }

    try {
      setUploading(true);

      const attachment = await createImageFromURL(url);

      await onImageSelect(attachment.id);

      onClose();

      setUploading(false);
    } catch {
      setUploading(false);
      setURLError('Unable to set image url.');
    }
  };

  return (
    <>
      <Box gap={16} width="100%" mb={16}>
        <TabGroup tabs={[{ label: 'Upload' }, { label: 'Link' }]} width="fill" activeTab={activeTab} onChange={setActiveTab} />

        {onLibraryClick && (
          <Box mr={-8}>
            <SquareButton size="medium" iconName="Tiles" onClick={onLibraryClick} />
          </Box>
        )}
      </Box>

      <Switch value={activeTab}>
        <Switch.Pane value={0}>
          <UploadArea
            label="Drop image or GIF here"
            error={!!uploadError}
            onUpload={onUpload}
            maxFiles={1}
            isLoading={uploading}
            errorMessage={uploadError}
            imagePreview={imagePreviewContainsURL ? undefined : imagePreviewURL}
            acceptedFileTypes={{ 'image/*': MEDIA_FILE_TYPES.IMAGE }}
          />
        </Switch.Pane>

        <Switch.Pane value={1}>
          <MediaLibraryImageUploadURLSection error={urlError} imageUrl={imageUrl} isLoading={uploading} onUrlSubmit={onUrlSubmit} />
        </Switch.Pane>
      </Switch>
    </>
  );
};
