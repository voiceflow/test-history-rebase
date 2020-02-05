import _ from 'lodash';
import React from 'react';
import { useDropzone } from 'react-dropzone10';

import { LoadCircle } from '@/components/Loader';
import SvgIcon from '@/components/SvgIcon';
import { IMAGE_FILE_FORMATS } from '@/constants';

import { ErrorText, IconUploadContainer, IconUploadInput, ImageContainer } from './components';

const SIZE_VARIANT = {
  xlarge: 150,
  large: 120,
  medium: 100,
  small: 80,
};

function Icon({ image, size = 'small', isLoading, error, onDropAccepted, acceptedFileTypes = IMAGE_FILE_FORMATS, className }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: acceptedFileTypes,
    onDropAccepted,
    onDropRejected: _.noop(),
    disabled: isLoading,
  });

  const iconSize = SIZE_VARIANT[size];
  const placeholderIconSize = SIZE_VARIANT[size] / 4;
  const iconUploadInput = React.useRef();

  const clickIconInput = () => {
    if (isLoading) return;
    iconUploadInput.current?.click();
  };

  let content = null;
  if (isDragReject) {
    content = <ErrorText>Invalid</ErrorText>;
  } else if (error) {
    content = <ErrorText>Error</ErrorText>;
  } else if (isLoading) {
    content = <LoadCircle color="transparent" isMd isEmpty />;
  } else if (!image) {
    content = <SvgIcon size={placeholderIconSize} color="#BECEDC" icon="image" />;
  }

  return (
    <IconUploadContainer className={className} {...getRootProps()} isActive={isDragActive}>
      <IconUploadInput onChange={onDropAccepted} ref={iconUploadInput} type="file" accept={acceptedFileTypes} {...getInputProps()} />
      <ImageContainer isLoading={isLoading} onClick={clickIconInput} size={iconSize} image={image} notAccepted={isDragReject} error={error}>
        {content}
      </ImageContainer>
    </IconUploadContainer>
  );
}

export default Icon;
