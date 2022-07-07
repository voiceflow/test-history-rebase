import React from 'react';

import { prettifyBucketURL, validateFiles, validateURL } from '../../utils';
import UploadBase, { UploadBaseProps } from '../Base';
import { InputRenderer } from '../LinkInput';
import * as S from './styles';

export interface UploadAudioProps extends Pick<UploadBaseProps, 'value' | 'onChange'> {
  endpoint?: string;
  renderInput?: InputRenderer;
}

const UploadAudio: React.FC<UploadAudioProps> = ({ endpoint = '/audio', onChange, renderInput, value }) => (
  <UploadBase
    label="audio file"
    fileType="audio"
    linkInputPlaceholder={renderInput ? "Add link or Variable using '{'" : 'Add link'}
    endpoint={endpoint}
    validate={validateFiles}
    validateLink={validateURL}
    value={value}
    onChange={onChange}
    renderInput={renderInput}
    renderValue={({ value }) => <S.Player title={prettifyBucketURL(value)} link={value} onClose={() => onChange(null)} />}
  />
);

export default UploadAudio;
