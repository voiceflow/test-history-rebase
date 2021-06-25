import { css, styled, transition } from '../../../styles';
import { ButtonContainer } from '../../Button';
import { IconButtonVariant } from '../types';

export interface BaseContainerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
}

export interface IconButtonContainerSharedProps extends BaseContainerProps {
  large?: boolean;
  active?: boolean;
}

export interface IconButtonContainerProps extends IconButtonContainerSharedProps {
  variant?: IconButtonVariant.NORMAL;
}

const SIZE = {
  small: 34,
  large: 42,
};

export const importantStyles = css`
  background: linear-gradient(180deg, rgba(93, 157, 245, 0.14) 0%, rgba(44, 133, 255, 0.205899) 97.03%), #fff;
`;

export const activeStyle = css`
  ${importantStyles}

  color: #5d9df5;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #5b9dfa99 !important;

  &:hover {
    color: #5d9df5;
  }
`;

const IconButtonContainer = styled(ButtonContainer)<IconButtonContainerProps>`
  ${transition('box-shadow', 'color')}

  position: relative;
  z-index: 1;
  background-color: #fff;
  background-size: cover;
  border: 1px solid transparent;

  height: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};
  width: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};

  color: rgba(110, 132, 154, 0.75);
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);

  &:hover {
    color: rgba(110, 132, 154, 1);
  }

  &:active {
    ${activeStyle}
  }

  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
        `
      : css`
          &:hover {
            box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 6px 0 rgba(17, 49, 96, 0.24);
          }
        `}

  ${({ active }) => active && activeStyle}
`;

export default IconButtonContainer;
