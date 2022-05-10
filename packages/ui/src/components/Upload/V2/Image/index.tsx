import Button, { ButtonVariant } from '@ui/components/Button';
import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import { IMAGE_FILE_FORMATS } from '../../constants';
import { validateFiles } from '../../utils';
import UploadBase, { UploadBaseProps } from '../Base';
import { InputRenderer } from '../LinkInput';
import * as S from './styles';

export interface UploadImageProps extends Pick<UploadBaseProps, 'value' | 'onChange'> {
  endpoint?: string;
  acceptedFileTypes?: string[];
  ratio?: number;
  autoHeight?: boolean;
  renderInput?: InputRenderer;
}

const UploadImage: React.FC<UploadImageProps> = ({
  acceptedFileTypes = IMAGE_FILE_FORMATS,
  autoHeight,
  endpoint = '/image',
  onChange,
  ratio,
  renderInput,
  value,
}) => (
  <UploadBase
    label="image/GIF"
    fileType="image"
    endpoint={endpoint}
    validate={validateFiles}
    value={value}
    onChange={onChange}
    linkInputPlaceholder={renderInput ? 'Enter file URL or {variable}' : 'Enter file URL'}
    acceptedFileTypes={acceptedFileTypes}
    renderInput={renderInput}
    renderValue={({ value, openFileSelection }) => (
      <S.Container src={value}>
        <S.Controls>
          <Button squareRadius opaque variant={ButtonVariant.SECONDARY} onClick={openFileSelection}>
            Browse
          </Button>
          <Button squareRadius opaque variant={ButtonVariant.SECONDARY} onClick={() => onChange('')}>
            <SvgIcon icon="trash" width={14} height={18} color="#92a2b3" />
          </Button>
        </S.Controls>
        <S.ImageViewport autoHeight={autoHeight} ratio={ratio}>
          <S.Image src={value} />
        </S.ImageViewport>
      </S.Container>
    )}
  />
);

export default UploadImage;
