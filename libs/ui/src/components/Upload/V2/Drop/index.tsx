import { LoadCircle } from '@ui/components/Loader';
import SvgIcon from '@ui/components/SvgIcon';
import Text from '@ui/components/Text';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { UPLOAD_ERROR } from '../../constants';
import { useFileTypesToMimeType } from '../../hooks';
import { RootDropAreaProps, ValueRendererProps } from '../../types';
import { UploadAPI } from '../../useUpload';
import * as S from './styles';

export { default as DropContent } from './components/Content';

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
  onRemoveFile?: () => void;
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
    onRemoveFile,
  },
  ref
) => {
  const accept = useFileTypesToMimeType(acceptedFileTypes);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    disabled: !!isLoading,
    onDropAccepted,
    onDropRejected,
  });

  const { onClick, ...rootProps } = getRootProps();
  let content = null;
  const hasError = isDragReject || error;

  if (hasError) {
    content = (
      <S.ErrorContainer>
        <SvgIcon icon="warning" mr="12px" />
        {error || UPLOAD_ERROR.INVALID_FILE_TYPE}
      </S.ErrorContainer>
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

  const renderContent = (content: React.ReactNode) => {
    if (value && !hasError && !isLoading) {
      return (
        <S.DropFileContainer>
          <S.CornerActionButton onClick={onRemoveFile} icon="close" clickable />
          <SvgIcon icon="checkSquare" color="#38751F" style={{ marginRight: 12 }} />
          <Text style={{ color: '#132144' }}>{value}</Text>
        </S.DropFileContainer>
      );
    }

    return (
      <S.DropContainer onClick={(event) => (error ? setError?.(null) : onClick?.(event))}>
        <S.Container ref={ref} active={isDragActive} hasError={isDragReject || !!error} className={className}>
          {content}
        </S.Container>
      </S.DropContainer>
    );
  };

  return (
    <S.RootDropArea {...rootDropAreaProps} {...rootProps} onContextMenu={(event) => event.stopPropagation()}>
      <input style={{ display: 'none' }} {...getInputProps()} />

      {hasDisplayableValue ? renderValue?.({ value, openFileSelection: onClick }) : renderContent(content)}
    </S.RootDropArea>
  );
};

export default React.forwardRef<HTMLDivElement, UploadDropProps>(UploadDrop);
