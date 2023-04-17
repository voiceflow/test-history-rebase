import { Input, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const onChange = () => {};
const renderInput = (props: any) => (<Input {...props} />) as any;

const renderBaseBlock = (children: JSX.Element) => <div style={{ width: 386 }}>{children}</div>;

const base = createExample('Image', () => renderBaseBlock(<UploadV2.Image renderInput={renderInput} onChange={onChange} value="" />));

const withImage = createExample('Image with value', () =>
  renderBaseBlock(
    <UploadV2.Image
      renderInput={renderInput}
      onChange={onChange}
      ratio={75.95015576323988}
      value="https://s3.amazonaws.com/dev-voiceflow-images/1651853928724-group-16.png"
    />
  )
);

const autoHeight = createExample('Image with autoHeight', () =>
  renderBaseBlock(
    <UploadV2.Image
      renderInput={renderInput}
      onChange={onChange}
      ratio={75.95015576323988}
      autoHeight
      value="https://s3.amazonaws.com/dev-voiceflow-images/1651853928724-group-16.png"
    />
  )
);

export default createSection('UploadV2.Image', 'src/components/Upload/Image/index.tsx', [base, withImage, autoHeight]);
