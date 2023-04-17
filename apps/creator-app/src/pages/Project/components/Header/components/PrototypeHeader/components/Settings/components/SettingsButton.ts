import { Button, ButtonVariant, SecondaryButtonProps } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

const SettingsButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY })<SecondaryButtonProps & { isActive: boolean }>`
  svg {
    ${transition('opacity', 'color')}
    color: #8194a8;
    opacity: 0.85;
  }

  &:hover svg {
    opacity: 1;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      svg {
        color: #132144;
        opacity: 1;
      }
    `}
`;

export default SettingsButton;
