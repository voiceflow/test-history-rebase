import type { PrimaryButtonProps } from '@voiceflow/ui';
import { Button, PrimaryButton } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface IconedButtonProps extends PrimaryButtonProps {
  isOpen: boolean;
}

export const IconedButton = styled(Button)<IconedButtonProps>`
  cursor: pointer;
  border-top-left-radius: 2px !important;
  border-bottom-left-radius: 2px !important;
  width: 42px;
  display: flex;
  align-items: center;
  background-color: ${({ isOpen }) => (isOpen ? '#2f75d6' : '#3d82e2')};

  ${PrimaryButton.Icon} {
    background: none;
    margin-right: 1px;
    margin-top: 1px;
  }

  ${PrimaryButton.Label} {
    padding: 0;
  }
`;

interface RunTestButtonProps extends PrimaryButtonProps {
  withIconButton: boolean;
}

export const RunTestButton = styled(Button)<RunTestButtonProps>`
  ${({ withIconButton }) =>
    withIconButton &&
    css`
      border-top-right-radius: 2px !important;
      border-bottom-right-radius: 2px !important;
      margin-right: 1px;
      cursor: pointer;
      width: 108px;
    `}
`;
