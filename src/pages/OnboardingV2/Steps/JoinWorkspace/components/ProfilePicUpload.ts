import { JustIconUpload } from '@/components/Upload/ImageUpload/IconUpload/index';
import { styled } from '@/hocs';

const IconUpload: any = JustIconUpload;

const ProfilePicUpload = styled(IconUpload)`
  display: inline-block;
  margin-left: 10px;
  position: relative;
  top: 2px;
`;

export default ProfilePicUpload;
