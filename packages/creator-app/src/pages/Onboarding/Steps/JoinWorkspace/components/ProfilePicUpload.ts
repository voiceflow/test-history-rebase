import { UploadIconVariant, UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { styled } from '@/hocs';

const ProfilePicUpload = styled(UploadJustIcon).attrs({ size: UploadIconVariant.EXTRA_LARGE })`
  display: inline-block;
  margin-left: 10px;
  position: relative;
`;

export default ProfilePicUpload;
