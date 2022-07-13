import { LoadCircle } from '@ui/components/Loader';
import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import { UPLOAD_ERROR } from '../../constants';
import { UploadAPI } from '../../useUpload';
import * as S from './styles';

export interface UploadDropProps extends Partial<UploadAPI> {
  label?: string;
  className?: string;
  isDragActive?: boolean;
  isDragReject?: boolean;
}

const UploadDrop: React.ForwardRefRenderFunction<HTMLDivElement, UploadDropProps> = (
  { label, isLoading, className, isDragActive, isDragReject, error },
  ref
) => {
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
    <S.Container ref={ref} active={isDragActive} hasError={isDragReject || !!error} className={className}>
      {content}
    </S.Container>
  );
};

export default React.forwardRef<HTMLDivElement, UploadDropProps>(UploadDrop);
