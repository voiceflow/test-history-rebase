import { flexCenterStyles } from '@ui/components/Flex';
import { css, styled } from '@ui/styles';

export interface BaseButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

export const baseButtonStyles = css<BaseButtonProps>`
  ${flexCenterStyles}

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
