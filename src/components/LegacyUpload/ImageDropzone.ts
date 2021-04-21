import Dropzone from 'react-dropzone';

import { imageDropzoneGraphic } from '@/assets';
import { styled } from '@/hocs';

const ImageDropzone = styled(Dropzone)`
  background: url(${imageDropzoneGraphic}) 50% 50%, linear-gradient(to bottom, rgba(212, 217, 230, 0.16) 0%, rgba(212, 217, 230, 0.3) 100%);
  background-repeat: no-repeat;
  background-position: center;
`;

export default ImageDropzone;
