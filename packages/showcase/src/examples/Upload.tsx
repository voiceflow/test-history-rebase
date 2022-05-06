import { Flex, Input, Upload } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const update = () => {};
const renderInput = (props: any) => (<Input {...props} />) as any;

const renderBaseBlock = (children: JSX.Element) => <Flex style={{ width: 350 }}>{children}</Flex>;

const audioUpload = createExample('AudioUpload', () => renderBaseBlock(<Upload.AudioUpload update={update} renderInput={renderInput} />));
const dropUpload = createExample('DropUpload', () => renderBaseBlock(<Upload.DropUpload renderInput={renderInput} />));
const fullImage = createExample('FullImage', () => renderBaseBlock(<Upload.FullImage update={update} renderInput={renderInput} />));
const iconUpload = createExample('IconUpload', () => <Upload.IconUpload update={update} />);
const imageGroup = createExample('ImageGroup', () => renderBaseBlock(<Upload.ImageGroup update={update} renderInput={renderInput} />));
const jsonUpload = createExample('JsonUpload', () => renderBaseBlock(<Upload.JsonUpload fileName="test" onUpload={update} />));

export default createSection('Upload', 'src/components/Upload/index.ts', [audioUpload, dropUpload, fullImage, iconUpload, imageGroup, jsonUpload]);
