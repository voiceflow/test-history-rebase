import { Button, SecondaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const StyledButton = styled(Button).attrs({ small: true })<SecondaryButtonProps>``;

export default StyledButton;
