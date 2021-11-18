import { Nullable, READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import { LoadCircle, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Tooltip } from 'react-tippy';

import DropUpload from '@/components/Upload/Primitive/DropUpload';
import { HTTPS_URL_REGEX, IMAGE_FILE_FORMATS } from '@/constants';
import { InjectedWithUploadProps, withUpload } from '@/hocs';
import { useEnableDisable } from '@/hooks';

import { ErrorText } from '../IconUpload/components';
import { Container, Image, ImageContainer, ImageUploadInput, RemoveButton } from './components';

const AnyTypeImageUploadInput = ImageUploadInput as any;

const MAX_SIZE = 10 * 1024 * 1024;

const UPLOAD_ERROR = {
  TOO_LARGE: 'File exceeds 10MB, upload as a link',
  ONE_FILE_LIMIT: 'Only single file uploads allowed',
  INVALID_URL: 'The link is invalid, make sure to use https',
};

const validate = (acceptedFiles: Blob[]) => {
  if (acceptedFiles.length !== 1) {
    return UPLOAD_ERROR.ONE_FILE_LIMIT;
  }
  if (acceptedFiles[0].size > MAX_SIZE) {
    return UPLOAD_ERROR.TOO_LARGE;
  }
  return null;
};

export const validateLink = (link = '') => {
  if (!link.match(READABLE_VARIABLE_REGEXP) && !link.match(HTTPS_URL_REGEX)) {
    return UPLOAD_ERROR.INVALID_URL;
  }

  return null;
};

interface FullImageProps {
  image: Nullable<string>;
  update: (url: string | string[] | null) => void;
  showRemove: boolean;
  imageHeight?: number;
  canUseLink?: boolean;
  ratio?: number;
}

const FullImage: React.FC<FullImageProps & InjectedWithUploadProps> = ({
  image,
  update,
  setError,
  isLoading,
  error,
  onDropAccepted,
  onDropRejected,
  showRemove = true,
  imageHeight,
  canUseLink = true,
  ratio,
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: IMAGE_FILE_FORMATS,
    onDropAccepted,
    onDropRejected: Utils.functional.noop,
    disabled: isLoading,
  });
  const [loadError, setLoadError] = React.useState<Nullable<string>>(null);
  const [removeButton, showRemoveButton, hideRemoveButton] = useEnableDisable(false);

  const imageUploadRef = React.useRef<HTMLInputElement>();

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
    content = <Tooltip title={image || undefined}>{image}</Tooltip>;
  } else if (image) {
    content = <Image src={image} ratio={ratio} />;
  }

  return image ? (
    <Container
      onMouseEnter={showRemoveButton}
      onMouseLeave={hideRemoveButton}
      {...getRootProps()}
      isActive={isDragActive}
      height={imageHeight}
      autoHeight={!!ratio}
    >
      <AnyTypeImageUploadInput onChange={onDropAccepted} ref={imageUploadRef} type="file" accept={IMAGE_FILE_FORMATS} {...getInputProps()} />
      <>
        {showRemove && removeButton && (
          <RemoveButton onClick={stopPropagation(() => update(''))}>
            <SvgIcon size={8} icon="close" color="#8da2b5" />
          </RemoveButton>
        )}

        <ImageContainer onClick={clickImageInput}>{content}</ImageContainer>
      </>
    </Container>
  ) : (
    <DropUpload
      onUpdate={update}
      height={imageHeight}
      setError={setError}
      label="image/GIF"
      isImage
      linkPlaceholder="Add link or Variable using '{'"
      clearError={() => setError(null)}
      onValidateLink={validateLink}
      acceptedFileTypes={IMAGE_FILE_FORMATS}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
      isLoading={isLoading}
      error={error}
      withVariables
      canUseLink={canUseLink}
    />
  );
};

export default withUpload(FullImage as React.FC<InjectedWithUploadProps>, { fileType: 'image', clientFunc: 'uploadImage', validate });
