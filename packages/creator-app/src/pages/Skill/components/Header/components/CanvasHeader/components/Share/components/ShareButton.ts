import { Button, ButtonVariant, SecondaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs';

const ShareButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY, flat: true, small: true })<SecondaryButtonProps>`
  margin-left: 16px;
  margin-right: 20px;
`;

export default ShareButton;
