import { flexCenterStyles } from '@/components/Flex';
import { css, styled } from '@/styles';
import { fontResetStyle } from '@/styles/bootstrap';

export interface BaseButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

export const baseButtonStyles = css<BaseButtonProps>`
  ${fontResetStyle};
  ${flexCenterStyles};

  ${({ disabled }) =>
    disabled
      ? css`
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `}

  padding: 0;
  border: 0;
  background: inherit;

  &:focus,
  &:active {
    outline: 0;
  }
`;

const BaseButton = styled.button<BaseButtonProps>`
  ${baseButtonStyles}
`;

export default BaseButton;
