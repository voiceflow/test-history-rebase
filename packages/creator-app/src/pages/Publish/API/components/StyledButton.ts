import { Button, SecondaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs';

const StyledButton = styled(Button).attrs({ flat: true, small: true })<SecondaryButtonProps>``;

export default StyledButton;
