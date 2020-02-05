/* eslint-disable valid-jsdoc */
import React from 'react';

import Flex from '@/componentsV2/Flex';
import DropUpload from '@/componentsV2/Upload/Primitive/DropUpload';
import { IMAGE_FILE_FORMATS } from '@/constants';
import { styled, withUpload } from '@/hocs';

import IconUpload from '../IconUpload';

const Icon = styled(IconUpload)`
  margin-left: 16px;
`;

const hasError = (acceptedFiles) => {
  return !IMAGE_FILE_FORMATS.includes(acceptedFiles[0].type);
};

/**
 * This is a basic component for image icon upload
 * It is basically UI component to show browse box and icon
 * all props are being passed down from hoc - withUpload
 * required props: update, image
 */
function ImageGroup({ update, image, setError, ...props }) {
  return (
    <Flex>
      {!image && <DropUpload onUpdate={update} label="image" clearError={() => setError(null)} acceptedFileTypes={IMAGE_FILE_FORMATS} {...props} />}
      <Icon image={image} update={update} acceptedFileTypes={IMAGE_FILE_FORMATS} {...props} />
    </Flex>
  );
}

export default withUpload(ImageGroup, { fileType: 'image', clientFunc: 'uploadImage', validate: hasError });
