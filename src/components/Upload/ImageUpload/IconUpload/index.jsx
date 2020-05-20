import _ from 'lodash';
import React from 'react';
import { useDropzone } from 'react-dropzone10';

import { LoadCircle } from '@/components/Loader';
import SvgIcon from '@/components/SvgIcon';
import { IMAGE_FILE_FORMATS } from '@/constants';
import { withUpload } from '@/hocs';

import { ErrorText, IconUploadContainer, IconUploadInput, ImageContainer } from './components';

const SIZE_VARIANT = {
  xlarge: 150,
  large: 120,
  medium: 100,
  small: 80,
  xsmall: 42,
};

const MINIMUM_ICON_SIZE = 14;

const hasError = (acceptedFiles) => {
  return !IMAGE_FILE_FORMATS.includes(acceptedFiles[0].type);
};

const Icon = React.forwardRef(
  ({ image, size = 'small', isLoading, error, onDropAccepted, acceptedFileTypes = IMAGE_FILE_FORMATS, className }, ref) => {
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      accept: acceptedFileTypes,
      onDropAccepted,
      onDropRejected: _.noop(),
      disabled: isLoading,
    });
    const iconSize = SIZE_VARIANT[size];
    const placeholderIconSize = Math.max(SIZE_VARIANT[size] / 4.75, MINIMUM_ICON_SIZE);
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
        <ImageContainer
          ref={ref}
          isLoading={isLoading}
          onClick={clickIconInput}
          size={iconSize}
          image={image}
          notAccepted={isDragReject}
          error={error}
        >
          {content}
        </ImageContainer>
      </IconUploadContainer>
    );
  }
);

// Have to have a separate export for a withUpload connected instance of Icon, because Icon is being used in its default form in ImageGroup component without withUpload
const JustIcon = React.forwardRef(({ update, image, ...props }, ref) => {
  return <Icon image={image} update={update} acceptedFileTypes={IMAGE_FILE_FORMATS} {...props} ref={ref} />;
});

export const UploadJustIcon = withUpload(JustIcon, { fileType: 'image', clientFunc: 'uploadImage', validate: hasError });

export default Icon;
