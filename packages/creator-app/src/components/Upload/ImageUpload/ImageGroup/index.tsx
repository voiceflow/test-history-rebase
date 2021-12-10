import { Flex } from '@voiceflow/ui';
import React from 'react';

import DropUpload from '@/components/Upload/Primitive/DropUpload';
import { IMAGE_FILE_FORMATS } from '@/constants';
import { ImageInjectedWithUploadProps, styled, withUpload } from '@/hocs';

import IconUpload from '../IconUpload';

const Icon = styled(IconUpload)`
  margin-left: 16px;
`;

const hasError = (acceptedFiles: File[]) => (!IMAGE_FILE_FORMATS.includes(acceptedFiles[0].type) ? 'File type Not Supported' : null);

interface ImageGroupOwnProps {
  image: string;
}

interface ImageGroupProps extends ImageGroupOwnProps, ImageInjectedWithUploadProps {}

/**
 * This is a basic component for image icon upload
 * It is basically UI component to show browse box and icon
 * all props are being passed down from hoc - withUpload
 * required props: update, image
 */
const ImageGroup = React.forwardRef<HTMLDivElement, ImageGroupProps>(({ update, image, setError, ...props }, ref) => (
  <Flex ref={ref}>
    {!image && (
      <DropUpload
        label="image"
        onUpdate={update}
        setError={setError}
        clearError={() => setError(null)}
        acceptedFileTypes={IMAGE_FILE_FORMATS}
        {...props}
      />
    )}

    <Icon image={image} update={update} acceptedFileTypes={IMAGE_FILE_FORMATS} setError={setError} canRemove {...props} />
  </Flex>
));

export default withUpload<HTMLDivElement, ImageGroupOwnProps>(ImageGroup, { validate: hasError, fileType: 'image', clientFunc: 'uploadImage' });
