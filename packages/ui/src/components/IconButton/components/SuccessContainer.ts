import { css, styled } from '../../../styles';
import { IconButtonVariant } from '../types';
import { beforeStyles } from './ActionContainer';
import IconButtonContainer, { IconButtonContainerSharedProps, importantStyles } from './IconButtonContainer';

export interface SuccessContainerProps extends IconButtonContainerSharedProps {
  variant: IconButtonVariant.SUCCESS;
}

const activeStyles = css`
  color: rgba(110, 132, 154, 0.8);
  border-color: rgba(39, 151, 69, 0.5);
  background: linear-gradient(-180deg, rgba(39, 151, 69, 0.08) 0%, rgba(39, 151, 69, 0.16) 100%);
  box-shadow: none !important;
  transition: opacity 0.12s linear, border-color 0.16s linear, box-shadow 0.12s linear;

  &:hover {
    color: rgba(110, 132, 154, 0.8);
  }
`;

const SuccessContainer = styled(IconButtonContainer)<SuccessContainerProps>`
  ${importantStyles}
  ${beforeStyles}

  position: relative;
  z-index: 1;
  line-height: 1;
  white-space: nowrap;
  text-align: center;
  background-color: #fff;
  background-size: cover;
  background: linear-gradient(-180deg, rgba(39, 151, 69, 0.08) 0%, rgba(39, 151, 69, 0.16) 100%);
  border: 1px solid transparent;
  border-color: #fff;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);
  cursor: pointer;

  &:before {
    background: linear-gradient(-180deg, rgba(39, 151, 69, 0.04) 0%, rgba(39, 151, 69, 0.08) 100%);
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    ${activeStyles}
  }

  ${({ active }) => active && activeStyles}
`;

export default SuccessContainer;
