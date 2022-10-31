import React from 'react';

import { validateFiles } from '../../utils';
import UploadBase, { UploadBaseProps } from '../Base';
import * as S from './styles';

export interface UploadTLSProps extends Pick<UploadBaseProps, 'onChange'> {
  endpoint?: string;
  label: string;
  value: string;
}

const UploadTLS: React.FC<UploadTLSProps> = ({ onChange, label, value }) => {
  return (
    <UploadBase
      label={label}
      value={value}
      fileType="TLS"
      endpoint="/tls"
      validate={validateFiles}
      onChange={onChange}
      onlyUpload={true}
      acceptedFileTypes={['.pem', '.cert', '.key']}
      renderValue={({ value }) => (
        <S.Container>
          <S.CornerActionButton onClick={() => onChange('')} size={14} icon="close" />
          <S.StatusButton size={16} icon="checkSquare" />
          {value.substring(value.indexOf('-') + 1)}
        </S.Container>
      )}
    />
  );
};

export default UploadTLS;
