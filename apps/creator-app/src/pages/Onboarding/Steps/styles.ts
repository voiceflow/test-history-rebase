import { Input } from '@voiceflow/ui';

import Upload from '@/components/legacy/Upload';
import { UploadIconVariant } from '@/components/legacy/Upload/ImageUpload/IconUpload';
import { styled } from '@/hocs/styled';

export const FieldsContainer = styled.div`
  margin-bottom: 40px;
`;

export const Label = styled.div`
  color: #62778c;
  font-size: 15px;
  font-weight: 600;

  margin-bottom: 11px;
  margin-top: 24px;
  :first-child {
    margin-top: 0;
  }
`;

export const NameInput = styled(Input)`
  display: inline-block;
  width: 300px;
`;

export const ProfilePicUpload = styled(Upload.IconUpload).attrs({ size: UploadIconVariant.EXTRA_SMALL })`
  display: inline-block;
  margin-left: 10px;
  position: relative;
`;
