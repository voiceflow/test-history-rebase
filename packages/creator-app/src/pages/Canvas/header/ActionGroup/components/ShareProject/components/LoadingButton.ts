import { Button, SecondaryButtonIcon } from '@voiceflow/ui';

import { styled } from '@/hocs';

const LoadingButton = styled(Button)`
  margin-top: 1px;
  pointer-events: none;

  ${SecondaryButtonIcon} {
    width: 20px;
    height: 20px;
  }
`;

export default LoadingButton;
