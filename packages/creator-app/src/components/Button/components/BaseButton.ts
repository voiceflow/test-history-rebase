import { flexCenterStyles } from '@/components/Flex';
import { css, styled } from '@/hocs';

import { ClickableProps, clickableStyles } from '../styles';

export const baseButtonStyles = css<BaseButtonProps>`
  ${flexCenterStyles}
  ${clickableStyles}

  padding: 0;
  border: 0;
  background: inherit;

  &:focus,
  &:active {
    outline: 0;
  }
`;

export type BaseButtonProps = ClickableProps & {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const BaseButton = styled.button<BaseButtonProps>`
  ${baseButtonStyles}
`;

export default BaseButton;
