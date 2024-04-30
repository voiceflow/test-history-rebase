import React from 'react';

import Flex from '@/components/Flex';

import { IMAGE_FILE_TYPES } from '../../constants';
import DropUpload from '../../Primitive/DropUpload';
import type { InputRenderer } from '../../Primitive/LinkUpload';
import type { SingleUploadConfig } from '../../useUpload';
import { useUpload } from '../../useUpload';
import { hasValidImages, validateURL } from '../../utils';
import * as S from './styles';

export interface ImageGroupProps extends Omit<SingleUploadConfig, 'fileType' | 'endpoint'> {
  image?: string | null;
  update: (value: string | null) => void;
  renderInput: InputRenderer;
}

const ImageGroup = React.forwardRef<HTMLDivElement, ImageGroupProps>(
  ({ update, image, errorMessage, renderInput, ...props }, ref) => {
    const { setError, error, isLoading, onDropAccepted, onDropRejected } = useUpload({
      fileType: 'image',
      endpoint: '/image',
      validate: hasValidImages,
      update,
      errorMessage,
    });

    return (
      <Flex ref={ref}>
        {!image && (
          <DropUpload
            label="image"
            onUpdate={update}
            setError={setError}
            clearError={() => setError(null)}
            acceptedFileTypes={IMAGE_FILE_TYPES}
            {...props}
            error={error}
            isLoading={isLoading}
            onValidateLink={validateURL}
            onDropAccepted={onDropAccepted}
            onDropRejected={onDropRejected}
            renderInput={renderInput}
          />
        )}
        <S.Icon
          image={image}
          update={update}
          acceptedFileTypes={IMAGE_FILE_TYPES}
          canRemove
          {...props}
          error={error}
          isLoading={isLoading}
          setError={setError}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
        />
      </Flex>
    );
  }
);

export default ImageGroup;
