import { Nullable } from '@voiceflow/common';
import { FlexCenter } from '@voiceflow/ui';
import { css } from 'styled-components';

import { styled, transition } from '@/hocs';

interface ImageContainerProps {
  size: number;
  image?: Nullable<string>;
  error: Nullable<string>;
  isLoading: boolean;
  notAccepted: boolean;
  isSquare?: boolean;
  disabled?: boolean;
}

const ImageContainer = styled(FlexCenter)<ImageContainerProps>`
  ${transition('background-color', 'border')}
  border-radius: ${({ isSquare }) => (isSquare ? '20%' : '50%')};
  border: 1px solid #d4d9e6;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background-color: #f6f7fa;
  background-position: center center;
  background-size: cover;
  background-image: ${({ image }) => image && `url(${image})`};
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};

  &:hover {
    background-color: #f1f3f8;
  }

  &:before {
    background: none;
    border: 2px solid #fff;
    border-radius: ${({ isSquare }) => (isSquare ? '20%' : '50%')};
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      background-color: #fff;
      :hover {
        background-color: #fff;
      }
    `}

  ${({ error, notAccepted }) =>
    (error || notAccepted) &&
    css`
      background-color: rgba(233, 30, 99, 0.1);
      border: 1px solid red;
    `}
`;

export default ImageContainer;
