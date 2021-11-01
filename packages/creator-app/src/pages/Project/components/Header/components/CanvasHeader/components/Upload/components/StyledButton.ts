import { Button, ButtonVariant, SecondaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs';

const Popup = styled(Button).attrs({ variant: ButtonVariant.SECONDARY, flat: true, small: true })<SecondaryButtonProps>`
  margin-right: 10px;
`;

export default Popup;
