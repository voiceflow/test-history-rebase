/* eslint-disable valid-jsdoc */
import { Flex } from '@voiceflow/ui';
import React from 'react';

import DropUpload from '@/components/Upload/Primitive/DropUpload';
import { IMAGE_FILE_FORMATS } from '@/constants';
import { styled, withUpload } from '@/hocs';

import IconUpload from '../IconUpload';

const Icon = styled(IconUpload)`
  margin-left: 16px;
`;

const hasError = (acceptedFiles) => !IMAGE_FILE_FORMATS.includes(acceptedFiles[0].type);

/**
 * This is a basic component for image icon upload
 * It is basically UI component to show browse box and icon
 * all props are being passed down from hoc - withUpload
 * required props: update, image
 */
const ImageGroup = ({ update, image, setError, ...props }) => (
  <Flex>
    {!image && <DropUpload onUpdate={update} label="image" clearError={() => setError(null)} acceptedFileTypes={IMAGE_FILE_FORMATS} {...props} />}
    <Icon image={image} update={update} acceptedFileTypes={IMAGE_FILE_FORMATS} canRemove {...props} />
  </Flex>
);

export default withUpload(ImageGroup, { fileType: 'image', clientFunc: 'uploadImage', validate: hasError });
