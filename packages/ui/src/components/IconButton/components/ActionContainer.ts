import { css, styled } from '../../../styles';
import { IconButtonVariant } from '../types';
import Container, { IconButtonContainerSharedProps, importantStyles } from './IconButtonContainer';

export interface ActionContainerProps extends IconButtonContainerSharedProps {
  variant: IconButtonVariant.ACTION;
}

export const beforeStyles = css`
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    border-radius: 50%;
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.04) 0%, rgba(44, 133, 255, 0.12) 100%);
    -webkit-transition: opacity 0.12s linear, -webkit-box-shadow 0.12s linear;
    transition: opacity 0.12s linear, -webkit-box-shadow 0.12s linear;
  }

  &:active::before {
    opacity: 1;
    box-shadow: inset 0 0 0 1px #fff;
  }
`;

const ActionContainer = styled(Container)<ActionContainerProps>`
  ${importantStyles}
  ${beforeStyles}

  border: 1px solid #fff;
  color: #5d9df5;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);

  &:hover {
    box-shadow: 0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16);
    color: #5d9df5;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: 0px 1px 2px rgba(17, 49, 96, 0.16);
    `};
`;

export default ActionContainer;
