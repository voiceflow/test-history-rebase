import { noop } from 'lodash';
import React from 'react';
import { useDropzone } from 'react-dropzone10';
import { Tooltip } from 'react-tippy';

import { LoadCircle } from '@/components/Loader';
import SvgIcon from '@/components/SvgIcon';
import DropUpload from '@/componentsV2/Upload/Primitive/DropUpload';
import { HTTPS_URL_REGEX, IMAGE_FILE_FORMATS, VARIABLE_STRING_REGEXP } from '@/constants';
import { withUpload } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { stopPropagation } from '@/utils/dom';

import { ErrorText } from '../IconUpload/components';
import { Container, Image, ImageContainer, ImageUploadInput, RemoveButton } from './components';

const MAX_SIZE = 10 * 1024 * 1024;

const UPLOAD_ERROR = {
  TOO_LARGE: 'File exceeds 10MB, upload as a link',
  ONE_FILE_LIMIT: 'Only single file uploads allowed',
  INVALID_URL: 'The link is invalid, make sure to use https',
};

const validate = (acceptedFiles) => {
  if (acceptedFiles.length !== 1) {
    return UPLOAD_ERROR.ONE_FILE_LIMIT;
  }
  if (acceptedFiles[0].size > MAX_SIZE) {
    return UPLOAD_ERROR.TOO_LARGE;
  }
  return false;
};

const validateLink = (link = '') => {
  if (!link.match(VARIABLE_STRING_REGEXP) && !HTTPS_URL_REGEX.test(link)) {
    return UPLOAD_ERROR.INVALID_URL;
  }

  return null;
};

function FullImage({ image, update, setError, isLoading, error, onDropAccepted, onDropRejected, showRemove = true, imageHeight = 230 }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: IMAGE_FILE_FORMATS,
    onDropAccepted,
    onDropRejected: noop(),
    disabled: isLoading,
  });
  const [loadError, setLoadError] = React.useState(null);
  const [removeButton, showRemoveButton, hideRemoveButton] = useEnableDisable(false);

  const imageUploadRef = React.useRef();

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
    content = <LoadCircle color="transparent" isMd isEmpty />;
  } else if (loadError) {
    content = <Tooltip title={image}>{image}</Tooltip>;
  } else if (image) {
    content = <Image src={image} onError={(err) => setLoadError(err)} />;
  }

  return image ? (
    <Container onMouseEnter={showRemoveButton} onMouseLeave={hideRemoveButton} {...getRootProps()} isActive={isDragActive} height={imageHeight}>
      <ImageUploadInput onChange={onDropAccepted} ref={imageUploadRef} type="file" accept={IMAGE_FILE_FORMATS} {...getInputProps()} />

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
      label="image"
      linkPlaceholder="Add link or Variable using '{'"
      clearError={() => setError(null)}
      onValidateLink={validateLink}
      acceptedFileTypes={IMAGE_FILE_FORMATS}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
      isLoading={isLoading}
      error={error}
      withVariables
    />
  );
}

export default withUpload(FullImage, { fileType: 'image', clientFunc: 'uploadImage', validate });
