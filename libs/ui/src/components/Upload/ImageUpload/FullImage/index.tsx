import type { Nullable } from '@voiceflow/common';
import { READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { LoadCircle } from '@/components/Loader';
import SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { useEnableDisable } from '@/hooks';
import { stopPropagation } from '@/utils';

import { HTTPS_URL_REGEX, IMAGE_FILE_TYPES, UPLOAD_ERROR } from '../../constants';
import { useFileTypesToMimeType } from '../../hooks';
import type { DropUploadProps } from '../../Primitive/DropUpload';
import DropUpload from '../../Primitive/DropUpload';
import type { InputRenderer } from '../../Primitive/LinkUpload';
import type { SingleUploadConfig } from '../../useUpload';
import { useUpload } from '../../useUpload';
import { validateFiles } from '../../utils';
import { ErrorText, RemoveButton } from '../styles';
import * as S from './styles';

export const validateLink = (link = '') => {
  if (!link.match(READABLE_VARIABLE_REGEXP) && !link.match(HTTPS_URL_REGEX)) {
    return UPLOAD_ERROR.INVALID_URL;
  }
  return null;
};

interface FullImageOwnProps {
  image?: Nullable<string>;
  ratio?: number;
  showRemove?: boolean;
  canUseLink?: boolean;
  imageHeight?: number;
  renderInput: InputRenderer;
}

export interface FullImageProps
  extends Omit<SingleUploadConfig, 'fileType' | 'endpoint'>,
    FullImageOwnProps,
    Omit<DropUploadProps, 'renderInput'> {
  endpoint?: string;
  update: (value: string | null) => void;
}

const FullImage = React.forwardRef<HTMLDivElement, FullImageProps>(
  (
    {
      image,
      ratio,
      update,
      canUseLink = true,
      showRemove = true,
      imageHeight,
      endpoint = 'image',
      errorMessage,
      renderInput,
    },
    ref
  ) => {
    const { error, setError, isLoading, onDropAccepted, onDropRejected } = useUpload({
      update,
      fileType: 'image',
      endpoint,
      validate: validateFiles,
      errorMessage,
    });

    const [loadError, setLoadError] = React.useState<Nullable<string>>(null);
    const [removeButton, showRemoveButton, hideRemoveButton] = useEnableDisable(false);

    const accept = useFileTypesToMimeType(IMAGE_FILE_TYPES);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      accept,
      disabled: isLoading,
      onDropAccepted,
      onDropRejected: Utils.functional.noop,
    });

    const imageUploadRef = React.useRef<HTMLInputElement>(null);

    const clickImageInput = () => {
      if (isLoading) {
        return;
      }

      imageUploadRef.current?.click();
    };

    React.useEffect(() => {
      setLoadError(null);
    }, [image]);

    let content = null;

    if (isDragReject) {
      content = <ErrorText>Invalid</ErrorText>;
    } else if (error) {
      content = <ErrorText>Error</ErrorText>;
    } else if (isLoading) {
      content = <LoadCircle color="transparent" isMd />;
    } else if (loadError) {
      content = <TippyTooltip content={image || undefined}>{image}</TippyTooltip>;
    } else if (image) {
      content = <S.Image src={image} ratio={ratio} />;
    }

    return image ? (
      <S.Container
        ref={ref}
        onMouseEnter={showRemoveButton}
        onMouseLeave={hideRemoveButton}
        {...(getRootProps() as any)}
        height={imageHeight}
        isActive={isDragActive}
        autoHeight={!!ratio}
      >
        <S.ImageUploadInput
          ref={imageUploadRef}
          type="file"
          accept={Object.keys(accept).join(',')}
          {...getInputProps()}
        />

        {showRemove && removeButton && (
          <RemoveButton onClick={stopPropagation(() => update(''))}>
            <SvgIcon size={8} icon="close" color="#8da2b5" />
          </RemoveButton>
        )}

        <S.ImageContainer onClick={clickImageInput}>{content}</S.ImageContainer>
      </S.Container>
    ) : (
      <DropUpload
        ref={ref}
        error={error}
        label="image/GIF"
        isImage
        height={imageHeight}
        onUpdate={update}
        setError={setError}
        isLoading={isLoading}
        clearError={() => setError(null)}
        canUseLink={canUseLink}
        renderInput={renderInput}
        onValidateLink={validateLink}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        linkPlaceholder="Add link or variable using '{'"
        acceptedFileTypes={IMAGE_FILE_TYPES}
      />
    );
  }
);

export default FullImage;
