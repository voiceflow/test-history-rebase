import type { SecondaryButtonProps } from '@voiceflow/ui';
import { Button, ButtonVariant } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const ShareButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY, small: true })<SecondaryButtonProps>``;

export default ShareButton;
