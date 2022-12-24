import { Button, ButtonVariant, SecondaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const ShareButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY, small: true })<SecondaryButtonProps>`
  margin-left: 16px;
  margin-right: 10px;
`;

export default ShareButton;
