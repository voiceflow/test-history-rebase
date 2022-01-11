import { Button, ButtonVariant, SecondaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs';

const ShareButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY, flat: true })<SecondaryButtonProps>`
  margin-right: 12px;
`;

export default ShareButton;
