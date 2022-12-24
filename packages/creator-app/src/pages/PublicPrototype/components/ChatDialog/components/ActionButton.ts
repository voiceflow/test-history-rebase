import { Button, ButtonVariant, changeColorShade, PrimaryButton } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const ActionButton = styled(Button)<{ isMobile?: boolean; color?: string }>`
  ${({ variant }) =>
    variant === ButtonVariant.TERTIARY &&
    css`
      width: 38px;
      background-color: transparent !important;
      padding: 0 10px !important;

      &:hover {
        color: ${({ theme }) => theme.colors.secondary};
      }
    `}

  ${({ isMobile }) =>
    isMobile &&
    css`
      height: 36px;

      ${PrimaryButton.Label} {
        padding: 0 10px !important;
      }
    `}

    ${({ color, disabled }) =>
    color &&
    css`
      background-color: ${color};

      :hover {
        background-color: ${disabled ? color : changeColorShade(color, -20)};
      }
    `}
`;

export default ActionButton;
