import { Utils } from '@voiceflow/common';
import { LoadCircle, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { RemoveButton } from '@/components/Upload/ImageUpload/FullImage/components';
import { IMAGE_FILE_FORMATS } from '@/constants';
import { InjectedWithUploadProps, withUpload } from '@/hocs';

import { ErrorText, IconUploadContainer, IconUploadInput, ImageContainer } from './components';

export const UploadIconVariant = {
  EXTRA_SMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'xlarge',
};

export const SIZE_VARIANT = {
  [UploadIconVariant.EXTRA_LARGE]: 150,
  [UploadIconVariant.LARGE]: 120,
  [UploadIconVariant.MEDIUM]: 100,
  [UploadIconVariant.SMALL]: 80,
  [UploadIconVariant.EXTRA_SMALL]: 42,
};

const MINIMUM_ICON_SIZE = 14;

const hasError = (acceptedFiles: Blob[]) => (!IMAGE_FILE_FORMATS.includes(acceptedFiles[0].type) ? 'Invalid File Type' : null);

interface IconProps {
  image: string;
  size?: number;
  isLoading?: boolean;
  canRemove?: boolean;
  update: (text: string) => void;
  acceptedFileTypes?: string[];
  className?: string;
  isSquare?: boolean;
  disabled?: boolean;
}

const Icon = React.forwardRef<HTMLDivElement, React.PropsWithoutRef<IconProps & InjectedWithUploadProps>>(
  (
    {
      image,
      size = 'small',
      isLoading,
      error,
      onDropAccepted,
      canRemove = false,
      update,
      acceptedFileTypes = IMAGE_FILE_FORMATS,
      className,
      isSquare,
      disabled,
    },
    ref
  ) => {
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      accept: acceptedFileTypes,
      onDropAccepted,
      onDropRejected: Utils.functional.noop,
      disabled: isLoading,
    });
    const iconSize = SIZE_VARIANT[size];
    const placeholderIconSize = Math.max(SIZE_VARIANT[size] / 4.75, MINIMUM_ICON_SIZE);
    const iconUploadInput = React.useRef<HTMLInputElement>();

    const clickIconInput = () => {
      if (disabled || isLoading) return;
      iconUploadInput.current?.click();
    };

    let content = null;
    if (isDragReject) {
      content = <ErrorText>Invalid</ErrorText>;
    } else if (error) {
      content = <ErrorText>Error</ErrorText>;
    } else if (isLoading) {
      content = <LoadCircle color="transparent" isMd />;
    } else if (!image) {
      content = <SvgIcon size={placeholderIconSize} color="#BECEDC" icon="image" />;
    }

    return (
      <IconUploadContainer className={className} {...(getRootProps() as any)} isActive={isDragActive}>
        {!disabled && (
          <IconUploadInput onChange={onDropAccepted} ref={iconUploadInput} type="file" accept={acceptedFileTypes} {...(getInputProps() as any)} />
        )}
        <ImageContainer
          ref={ref}
          isLoading={isLoading}
          onClick={clickIconInput}
          size={iconSize}
          image={image}
          notAccepted={isDragReject}
          error={error}
          isSquare={isSquare}
          disabled={disabled}
        >
          {canRemove && image && (
            <RemoveButton top={0} right={0} onClick={stopPropagation(() => update(''))}>
              <SvgIcon size={8} icon="close" color="#8da2b5" />
            </RemoveButton>
          )}
          {content}
        </ImageContainer>
      </IconUploadContainer>
    );
  }
);

interface JustIconProps {
  update: (text: string) => void;
  image: string;
}

// Have to have a separate export for a withUpload connected instance of Icon, because Icon is being used in its default form in ImageGroup component without withUpload
const JustIcon = React.forwardRef<HTMLDivElement, React.PropsWithoutRef<JustIconProps & InjectedWithUploadProps>>(
  ({ update, image, ...props }, ref) => <Icon image={image} update={update} acceptedFileTypes={IMAGE_FILE_FORMATS} {...props} ref={ref} />
);

export const UploadJustIcon = withUpload(JustIcon as unknown as React.FC<InjectedWithUploadProps>, {
  fileType: 'image',
  clientFunc: 'uploadImage',
  validate: hasError,
});

export default Icon;
