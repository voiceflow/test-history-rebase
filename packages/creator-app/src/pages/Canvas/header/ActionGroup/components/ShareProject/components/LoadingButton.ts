import { Button, ButtonVariant, SecondaryButtonIcon } from '@voiceflow/ui';

import { styled } from '@/hocs';

const LoadingButton = styled(Button).attrs({
  icon: 'publishSpin',
  square: true,
  variant: ButtonVariant.SECONDARY,
  iconProps: { spin: true, size: 20 },
})`
  pointer-events: none;
  margin-top: 1px;
  pointer-events: none;

  ${SecondaryButtonIcon} {
    width: 20px;
    height: 20px;
  }
`;

export default LoadingButton;
