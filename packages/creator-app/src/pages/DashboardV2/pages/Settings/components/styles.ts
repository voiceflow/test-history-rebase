import { Upload } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const UploadIcon = styled(Upload.IconUpload)`
  ${Upload.OverlayContainer} {
    border-radius: 12px;
  }
  ${Upload.ImageContainer} {
    border-radius: 12px;

    &::before {
      border-radius: 12px;
    }
  }
`;
