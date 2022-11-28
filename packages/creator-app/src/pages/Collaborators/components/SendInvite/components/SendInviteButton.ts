import { Button, ButtonVariant } from '@voiceflow/ui';

import { styled } from '@/hocs';

const SendInviteButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY })`
  margin-left: 15px;
`;

export default SendInviteButton;
