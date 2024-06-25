import React from 'react';

import { prettifyBucketURL, validateFiles, validateURL } from '../../utils';
import type { UploadBaseProps } from '../Base';
import UploadBase from '../Base';
import type { InputRenderer } from '../LinkInput';
import * as S from './styles';

export interface UploadAudioProps extends Pick<UploadBaseProps, 'value' | 'onChange'> {
  endpoint?: string;
  renderInput?: InputRenderer;
}

const UploadAudio: React.FC<UploadAudioProps> = ({ endpoint = 'audio', onChange, renderInput, value }) => (
  <UploadBase
    label="audio file"
    value={value}
    fileType="audio"
    onChange={onChange}
    endpoint={endpoint}
    validate={validateFiles}
    renderInput={renderInput}
    renderValue={({ value }) => (
      <S.Player title={prettifyBucketURL(value)} link={value} onClose={() => onChange(null)} showDuration />
    )}
    validateLink={validateURL}
    linkInputPlaceholder={renderInput ? "Add link or variable using '{'" : 'Add link'}
  />
);

export default UploadAudio;
