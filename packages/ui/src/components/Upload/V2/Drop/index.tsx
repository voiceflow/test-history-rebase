import { LoadCircle } from '@ui/components/Loader';
import React from 'react';

import { UploadAPI } from '../../useUpload';
import * as S from './styles';

export interface UploadDropProps extends Partial<UploadAPI> {
  label?: string;
  className?: string;
  isDragActive: boolean;
  isDragReject: boolean;
}

const UploadDrop: React.ForwardRefRenderFunction<HTMLDivElement, UploadDropProps> = (
  { label, isLoading, className, isDragActive, isDragReject },
  ref
) => {
  let content = null;

  if (isDragReject) {
    content = <S.ErrorMessage>Invalid file type</S.ErrorMessage>;
  } else if (isLoading) {
    content = <LoadCircle color="transparent" />;
  } else {
    content = (
      <S.Message>
        Drag &amp; Drop {label} here. Or,
        <br />
        <S.BrowseButton>Browse</S.BrowseButton>
      </S.Message>
    );
  }

  return (
    <S.Container ref={ref} active={isDragActive} className={className}>
      {content}
    </S.Container>
  );
};

export default React.forwardRef<HTMLDivElement, UploadDropProps>(UploadDrop);
