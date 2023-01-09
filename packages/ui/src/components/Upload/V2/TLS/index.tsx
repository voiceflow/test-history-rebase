import React from 'react';

import { validateFiles } from '../../utils';
import UploadBase, { UploadBaseProps } from '../Base';
import { DropContent } from '../Drop';

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
      renderValue={({ value }) => <DropContent value={value} onRemove={() => onChange('')} />}
    />
  );
};

export default UploadTLS;
