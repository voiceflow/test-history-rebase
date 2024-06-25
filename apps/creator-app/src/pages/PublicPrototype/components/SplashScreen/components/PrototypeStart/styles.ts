import type { PrimaryButtonProps } from '@voiceflow/ui';
import { FlexCenter, PrimaryButton } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

import { StyledButton } from '../../../common';

export const Container = styled(FlexCenter).attrs({ column: true })`
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface IconedButtonProps extends PrimaryButtonProps {
  isOpen: boolean;
}

export const IconedButton = styled(StyledButton)<IconedButtonProps>`
  cursor: pointer;
  border-top-left-radius: 2px !important;
  border-bottom-left-radius: 2px !important;
  width: 66px;
  height: 67px;
  display: flex;
  align-items: center;

  padding: 20px 0;

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

export const RunTestButton = styled(StyledButton)<RunTestButtonProps>`
  ${({ withIconButton }) =>
    withIconButton &&
    css`
      cursor: pointer;

      &:not(:last-child) {
        border-top-right-radius: 2px !important;
        border-bottom-right-radius: 2px !important;
        margin-right: 1px;
      }

      height: 67px;
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
    `}
`;
