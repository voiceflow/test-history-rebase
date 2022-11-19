import { LoadCircle } from '@ui/components/Loader';
import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { FILE_TYPE_MIME_MAP, UPLOAD_ERROR } from '../../constants';
import { RootDropAreaProps, ValueRendererProps } from '../../types';
import { UploadAPI } from '../../useUpload';
import * as S from './styles';

export interface UploadDropProps extends Partial<UploadAPI> {
  renderValue?: (props: ValueRendererProps) => JSX.Element;
  rootDropAreaProps?: RootDropAreaProps;
  hasDisplayableValue?: boolean;
  acceptedFileTypes?: string[];
  isDragActive?: boolean;
  isDragReject?: boolean;
  className?: string;
  label?: string;
  value?: string;
}

const UploadDrop: React.ForwardRefRenderFunction<HTMLDivElement, UploadDropProps> = (
  {
    hasDisplayableValue,
    rootDropAreaProps,
    acceptedFileTypes = [],
    className,
    isLoading,
    label,
    error,
    value = '',
    onDropAccepted,
    onDropRejected,
    renderValue,
    setError,
  },
  ref
) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: acceptedFileTypes.map((ext) => FILE_TYPE_MIME_MAP[ext] || ext),
    disabled: !!isLoading,
    onDropAccepted,
    onDropRejected,
  });

  const { onClick, ...rootProps } = getRootProps();
  let content = null;

  if (isDragReject || error) {
    content = (
      <>
        <SvgIcon icon="warning" mr="12px" />
        {error || UPLOAD_ERROR.INVALID_FILE_TYPE}
      </>
    );
  } else if (isLoading) {
    content = <LoadCircle color="transparent" />;
  } else {
    content = (
      <S.Message>
        Drag &amp; drop {label} here. Or,
        <br />
        <S.BrowseButton>Browse</S.BrowseButton>
      </S.Message>
    );
  }

  return (
    <S.RootDropArea {...rootDropAreaProps} {...rootProps} onContextMenu={(event) => event.stopPropagation()}>
      <input style={{ display: 'none' }} {...getInputProps()} />

      {hasDisplayableValue ? (
        renderValue?.({ value, openFileSelection: onClick })
      ) : (
        <S.DropContainer onClick={(event) => (error ? setError?.(null) : onClick?.(event))}>
          <S.Container ref={ref} active={isDragActive} hasError={isDragReject || !!error} className={className}>
            {content}
          </S.Container>
        </S.DropContainer>
      )}
    </S.RootDropArea>
  );
};

export default React.forwardRef<HTMLDivElement, UploadDropProps>(UploadDrop);
