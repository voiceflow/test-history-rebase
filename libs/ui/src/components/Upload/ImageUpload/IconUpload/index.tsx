import { LoadCircle } from '@ui/components/Loader';
import SvgIcon from '@ui/components/SvgIcon';
import User, { UserData } from '@ui/components/User';
import { stopPropagation } from '@ui/utils';
import { Utils } from '@voiceflow/common';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { IMAGE_FILE_TYPES } from '../../constants';
import { useFileTypesToMimeType } from '../../hooks';
import { ImageInjectedWithUploadProps } from '../../types';
import { SingleUploadConfig, useUpload } from '../../useUpload';
import { hasValidImages } from '../../utils';
import { ErrorText, RemoveButton } from '../styles';
import * as S from './styles';

export { ImageContainer, OverlayContainer } from './styles';

export enum UploadIconVariant {
  EXTRA_SMALL = 'xsmall',
  SMALLER = 'smaller',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'xlarge',
}

export const SIZE_VARIANT = {
  [UploadIconVariant.EXTRA_LARGE]: 150,
  [UploadIconVariant.LARGE]: 120,
  [UploadIconVariant.MEDIUM]: 100,
  [UploadIconVariant.SMALL]: 80,
  [UploadIconVariant.SMALLER]: 70,
  [UploadIconVariant.EXTRA_SMALL]: 42,
};

const MINIMUM_ICON_SIZE = 14;

export interface IconUploadOwnProps {
  size?: UploadIconVariant;
  image?: string | null;
  update?: (value: string | null) => void;
  isSquare?: boolean;
  disabled?: boolean;
  canRemove?: boolean;
  className?: string;
  acceptedFileTypes?: string[];
  user?: UserData;
}

export interface BaseIconUploadProps extends IconUploadOwnProps, Omit<ImageInjectedWithUploadProps, 'update'> {}

export const BaseIconUpload = React.forwardRef<HTMLDivElement, BaseIconUploadProps>(
  (
    {
      error,
      update,
      isLoading,
      onDropAccepted,

      size = UploadIconVariant.SMALL,
      image,
      isSquare,
      disabled,
      className,
      canRemove = false,
      acceptedFileTypes = IMAGE_FILE_TYPES,
      user,
    },
    ref
  ) => {
    const accept = useFileTypesToMimeType(acceptedFileTypes);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      accept,
      disabled: isLoading || disabled,
      onDropAccepted,
      onDropRejected: Utils.functional.noop,
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
    } else if (!image && !user) {
      content = <SvgIcon size={placeholderIconSize} color="rgba(110, 132, 154, 0.85)" icon="addImage" />;
    } else {
      content = (
        <S.OverlayContainer isSquare={isSquare}>
          <SvgIcon size={placeholderIconSize} color={image || user ? '#ffffff' : 'rgba(110, 132, 154, 0.85)'} icon="addImage" />
        </S.OverlayContainer>
      );
    }

    return (
      <S.IconUploadContainer className={className} {...(getRootProps() as any)} isActive={isDragActive}>
        {!disabled && (
          <S.IconUploadInput
            ref={iconUploadInput}
            type="file"
            accept={Object.keys(accept).join(',')}
            onChange={onDropAccepted}
            {...(getInputProps() as any)}
          />
        )}

        <S.ImageContainer
          ref={ref}
          size={iconSize}
          image={image}
          error={error}
          onClick={clickIconInput}
          isSquare={isSquare}
          disabled={disabled}
          isLoading={isLoading}
          notAccepted={isDragReject}
          isProfile={!!user}
        >
          {canRemove && image && (
            <RemoveButton top={0} right={0} onClick={stopPropagation(() => update?.(''))}>
              <SvgIcon size={8} icon="close" color="#8da2b5" />
            </RemoveButton>
          )}
          {user && <User user={user} flat extraLarge square />}
          {content}
        </S.ImageContainer>
      </S.IconUploadContainer>
    );
  }
);

export interface IconUploadProps extends IconUploadOwnProps, Omit<SingleUploadConfig, 'fileType' | 'endpoint' | 'validate' | 'update'> {
  endpoint?: string;
}

const IconUpload: React.ForwardRefRenderFunction<HTMLDivElement, IconUploadProps> = ({ update, endpoint = '/image', ...props }, ref) => {
  const uploadApi = useUpload({
    fileType: 'image',
    endpoint,
    update,
    validate: hasValidImages,
  });

  return <BaseIconUpload ref={ref} update={update} {...props} {...uploadApi} />;
};

export default React.forwardRef<HTMLDivElement, IconUploadProps>(IconUpload);
