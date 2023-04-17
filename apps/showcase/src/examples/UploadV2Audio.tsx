import { Input, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const onChange = () => {};
const renderInput = (props: any) => (<Input {...props} />) as any;

const renderBaseBlock = (children: JSX.Element) => <div style={{ width: 386 }}>{children}</div>;

const audio = createExample('Audio', () => renderBaseBlock(<UploadV2.Audio renderInput={renderInput} onChange={onChange} value="" />));

const audioWithFile = createExample('Audio with value', () =>
  renderBaseBlock(
    <UploadV2.Audio
      renderInput={renderInput}
      onChange={onChange}
      value="https://cm4-production-assets.s3.amazonaws.com/1652103306437-cartoon-sting---twin-musicom.mp3"
    />
  )
);

export default createSection('UploadV2.Audio', 'src/components/Upload/Audio/index.tsx', [audio, audioWithFile]);
