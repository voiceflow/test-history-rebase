import { styled } from '../../../styles';
import { baseButtonStyles, ClickableProps } from '../styles';

export type BaseButtonProps = ClickableProps & {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const BaseButton = styled.button<BaseButtonProps>`
  ${baseButtonStyles}
`;

export default BaseButton;
