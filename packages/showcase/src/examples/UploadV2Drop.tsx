import { Input, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const onChange = () => {};
const renderInput = (props: any) => (<Input {...props} />) as any;

const renderBaseBlock = (children: JSX.Element) => <div style={{ width: 386 }}>{children}</div>;

const base = createExample('Image', () => renderBaseBlock(<UploadV2.Image renderInput={renderInput} onChange={onChange} value="" />));

const dropWithError = createExample('Drop with error', () => renderBaseBlock(<UploadV2.Drop label="image" error="Sample error message" />));

export default createSection('UploadV2.Image', 'src/components/Upload/Image/index.tsx', [base, dropWithError]);
