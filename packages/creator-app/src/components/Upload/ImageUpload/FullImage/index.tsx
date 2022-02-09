import { Nullable, READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import { LoadCircle, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Tooltip } from 'react-tippy';

import DropUpload from '@/components/Upload/Primitive/DropUpload';
import { HTTPS_URL_REGEX, IMAGE_FILE_FORMATS } from '@/constants';
import { ImageInjectedWithUploadProps, withUpload } from '@/hocs';
import { useEnableDisable } from '@/hooks';

import { ErrorText } from '../IconUpload/components';
import { Container, Image, ImageContainer, ImageUploadInput, RemoveButton } from './components';

const MAX_SIZE = 10 * 1024 * 1024;

const UPLOAD_ERROR = {
  TOO_LARGE: 'File exceeds 10MB, upload as a link',
  ONE_FILE_LIMIT: 'Only single file uploads allowed',
  INVALID_URL: 'The link is invalid, make sure to use https',
};

const validate = (acceptedFiles: File[]) => {
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

interface FullImagePropsOwn {
  image?: Nullable<string>;
  ratio?: number;
  showRemove?: boolean;
  canUseLink?: boolean;
  imageHeight?: number;
}

interface FullImageProps extends ImageInjectedWithUploadProps, FullImagePropsOwn {}

const FullImage = React.forwardRef<HTMLDivElement, FullImageProps>(
  ({ error, image, ratio, update, setError, isLoading, canUseLink = true, showRemove = true, imageHeight, onDropAccepted, onDropRejected }, ref) => {
    const [loadError, setLoadError] = React.useState<Nullable<string>>(null);
    const [removeButton, showRemoveButton, hideRemoveButton] = useEnableDisable(false);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      accept: IMAGE_FILE_FORMATS,
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
      content = <Tooltip title={image || undefined}>{image}</Tooltip>;
    } else if (image) {
      content = <Image src={image} ratio={ratio} />;
    }

    return image ? (
      <Container
        ref={ref}
        onMouseEnter={showRemoveButton}
        onMouseLeave={hideRemoveButton}
        {...(getRootProps() as any)}
        height={imageHeight}
        isActive={isDragActive}
        autoHeight={!!ratio}
      >
        <ImageUploadInput ref={imageUploadRef} type="file" accept={IMAGE_FILE_FORMATS.join(',')} {...getInputProps()} />

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
        withVariables
        onValidateLink={validateLink}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        linkPlaceholder="Add link or Variable using '{'"
        acceptedFileTypes={IMAGE_FILE_FORMATS}
      />
    );
  }
);

export default withUpload<HTMLDivElement, FullImagePropsOwn>(FullImage, { fileType: 'image', clientFunc: 'uploadImage', validate });
