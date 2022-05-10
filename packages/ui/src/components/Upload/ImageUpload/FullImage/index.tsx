import { LoadCircle } from '@ui/components/Loader';
import SvgIcon from '@ui/components/SvgIcon';
import { useEnableDisable } from '@ui/hooks';
import { stopPropagation } from '@ui/utils';
import { Nullable, READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Tooltip } from 'react-tippy';

import { HTTPS_URL_REGEX, IMAGE_FILE_FORMATS, UPLOAD_ERROR } from '../../constants';
import DropUpload, { DropUploadProps } from '../../Primitive/DropUpload';
import { InputRenderer } from '../../Primitive/LinkUpload';
import { SingleUploadConfig, useUpload } from '../../useUpload';
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

export interface FullImageProps extends Omit<SingleUploadConfig, 'fileType' | 'endpoint'>, FullImageOwnProps, Omit<DropUploadProps, 'renderInput'> {
  endpoint?: string;
  update: (value: string | null) => void;
}

const FullImage = React.forwardRef<HTMLDivElement, FullImageProps>(
  ({ image, ratio, update, canUseLink = true, showRemove = true, imageHeight, endpoint = 'image', errorMessage, renderInput }, ref) => {
    const { error, setError, isLoading, onDropAccepted, onDropRejected } = useUpload({
      fileType: 'image',
      endpoint,
      update,
      validate: validateFiles,
      errorMessage,
    });

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
        <S.ImageUploadInput ref={imageUploadRef} type="file" accept={IMAGE_FILE_FORMATS.join(',')} {...getInputProps()} />

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
        linkPlaceholder="Add link or Variable using '{'"
        acceptedFileTypes={IMAGE_FILE_FORMATS}
      />
    );
  }
);

export default FullImage;
