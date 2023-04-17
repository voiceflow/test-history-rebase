import Button, { ButtonVariant } from '@ui/components/Button';
import React from 'react';

import { IMAGE_FILE_TYPES } from '../../constants';
import { validateFiles, validateImageUrl } from '../../utils';
import UploadBase, { UploadBaseProps } from '../Base';
import { InputRenderer } from '../LinkInput';
import * as S from './styles';

export interface UploadImageProps extends Pick<UploadBaseProps, 'value' | 'onChange' | 'rootDropAreaProps'> {
  ratio?: number | null;
  endpoint?: string;
  autoHeight?: boolean;
  renderInput?: InputRenderer;
  acceptedFileTypes?: string[];
  onlyUpload?: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({
  acceptedFileTypes = IMAGE_FILE_TYPES,
  autoHeight,
  endpoint = '/image',
  onChange,
  ratio,
  renderInput,
  value,
  rootDropAreaProps,
  onlyUpload = false,
}) => (
  <UploadBase
    onlyUpload={onlyUpload}
    label="image/GIF"
    fileType="image"
    endpoint={endpoint}
    validate={validateFiles}
    validateLink={validateImageUrl}
    value={value}
    onChange={onChange}
    linkInputPlaceholder={renderInput ? 'Enter file URL or {variable}' : 'Enter file URL'}
    acceptedFileTypes={acceptedFileTypes}
    renderInput={renderInput}
    rootDropAreaProps={rootDropAreaProps}
    renderValue={({ value, openFileSelection }) => (
      <S.Container src={value}>
        <S.Controls>
          <Button variant={ButtonVariant.WHITE} onClick={openFileSelection}>
            Browse
          </Button>
          <Button variant={ButtonVariant.WHITE} onClick={() => onChange('')} icon="trash" />
        </S.Controls>
        <S.ImageViewport autoHeight={autoHeight} ratio={ratio}>
          <S.Image src={value} />
        </S.ImageViewport>
      </S.Container>
    )}
  />
);

export default UploadImage;
