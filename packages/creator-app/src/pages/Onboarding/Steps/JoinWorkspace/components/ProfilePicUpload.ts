import { Upload, UploadIconVariant } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const ProfilePicUpload = styled(Upload.IconUpload).attrs({ size: UploadIconVariant.EXTRA_SMALL })`
  display: inline-block;
  margin-left: 10px;
  position: relative;
`;

export default ProfilePicUpload;
