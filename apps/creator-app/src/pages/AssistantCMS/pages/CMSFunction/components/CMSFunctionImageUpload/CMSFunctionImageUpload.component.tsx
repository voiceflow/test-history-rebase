import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, toast, UploadArea } from '@voiceflow/ui-next';
import React from 'react';

import { designerClient } from '@/client/designer';
import { MEDIA_FILE_TYPES } from '@/constants/media.constant';

import { uploadArea } from './CMSFunctionEditor.css';
import type { ICMSFunctionImageUpload } from './CMSFunctionImageUpload.interface';

export const CMSFunctionImageUpload: React.FC<ICMSFunctionImageUpload> = ({ value, onValueChange }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const uploadImage = async ([file]: File[]) => {
    setIsLoading(true);

    try {
      const { url } = await designerClient.upload.image({ image: file });
      onValueChange(url);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };
  return (
    <Collapsible
      isEmpty={!value}
      noBottomPadding
      header={<CollapsibleHeader label="Image">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
      testID="function__image-section"
    >
      <UploadArea
        acceptedFileTypes={{ 'image/*': MEDIA_FILE_TYPES.IMAGE }}
        isLoading={isLoading}
        label="Drop .jpg or .png here"
        onUpload={uploadImage}
        className={uploadArea}
        imagePreview={value ?? undefined}
        maxFiles={1}
        testID="function__image"
      />
    </Collapsible>
  );
};
